import {
	Injector,
	CIRCULAR,
	EMPTY,
	InjectedRecord,
	DependencyRecord,
	NULL_INJECTOR,
	IDENT,
	COMMON_PROVIDER_FN,
} from './Injector';
import { InjectorFlags, InjectOptionFlags } from './Flags';
import { ValueProvider } from './Providers';
import { resolveReference } from './reference';
import { StaticInjector, USE_VALUE } from './Injector';
import { Inject } from './tokens';
import {
	StaticProvider,
	ExistingProvider,
	StaticClassProvider,
	ConstructorProvider,
	FactoryProvider,
} from './Providers';

export function resolveToken({
	token,
	record,
	records,
	parent,
	notFoundValue,
	flags,
}: {
	token: any;
	record: InjectedRecord | undefined;
	records: Map<any, InjectedRecord>;
	parent: Injector;
	notFoundValue: any;
	flags: InjectorFlags;
}): any {
	let value;

	if (record && !(flags === InjectorFlags.SkipSelf)) {
		value = record.value;

		if (value === CIRCULAR) {
			throw new Error('Circular dependency');
		} else if (value === EMPTY) {
			record.value = CIRCULAR;

			let mustConstruct = record.useNew;
			let factory = record.fn;
			let dependencyRequires = record.requires;
			let dependencies = EMPTY;

			if (dependencyRequires.length) {
				dependencies = [];

				for (let i = 0; i < dependencyRequires.length; i++) {
					const dependency: DependencyRecord = dependencyRequires[i];
					const { options, token } = dependency;
					const childRecord = records.get(token); // options === InjectOptionFlags.CheckSelf ? records.get(token) : undefined;
					const shouldResolveParent = !childRecord && options === InjectOptionFlags.CheckParent;
					const isOptionalInjection = options === InjectOptionFlags.Optional;

					dependencies.push(
						resolveToken({
							token,
							record: childRecord,
							records,
							parent: shouldResolveParent ? NULL_INJECTOR : parent,
							notFoundValue: isOptionalInjection ? null : Injector.THROW_IF_NOT_FOUND,
							flags: InjectorFlags.Default,
						})
					);
				}

				record.value = value = mustConstruct
					? new (factory as any)(...dependencies)
					: factory.apply(undefined, dependencies);
			} else if (!(flags === InjectorFlags.Self)) {
				value = parent.get(token, notFoundValue, InjectorFlags.Default);
			}
		}
	}

	return value;
}

export function createSafeProvider(
	provider: ValueProvider | ExistingProvider | StaticClassProvider | ConstructorProvider | FactoryProvider
): InjectedRecord {
	const requires = computeRequiredDependencies(provider);

	let fn: Function = IDENT;
	let value: any = EMPTY;
	let useNew: boolean = false;

	if (USE_VALUE in provider) {
		value = (provider as ValueProvider).useValue;
	} else if ((provider as FactoryProvider).useFactory) {
		fn = (provider as FactoryProvider).useFactory;
	} else if ((provider as ExistingProvider).useExisting) {
		value = IDENT;
	} else if ((provider as StaticClassProvider).useClass) {
		useNew = true;
		fn = (provider as StaticClassProvider).useClass;
	} else if (typeof provider.provide == 'function') {
		useNew = true;
		fn = provider.provide;
	} else {
		throw new Error(`Provider ${provider} is not valid or not instanciable`);
	}
	return {
		requires,
		fn,
		useNew,
		value,
	};
}

export function resolveProviders(records: Map<any, InjectedRecord>, provider: StaticProvider) {
	if (!provider) {
		return;
	}

	provider = resolveReference(provider);

	if (provider instanceof Array) {
		for (let i = 0; i < provider.length; i++) {
			resolveProviders(records, provider[i]);
		}
	} else if (typeof provider === 'function') {
		throw new Error(`Using a function or Class is not supported (${provider})`);
	} else if (provider && typeof provider === 'object' && provider.provide) {
		let token = resolveReference(provider.provide);
		const resolvedProvider = createSafeProvider(provider);

		if (provider.multiple === true) {
			// This is a multi provider.
			let multiProvider: InjectedRecord | undefined = records.get(token);

			if (multiProvider) {
				if (multiProvider.fn !== COMMON_PROVIDER_FN) {
					throw new Error(`Can't mix multi providers with statics (${token})`);
				}
			} else {
				// Create a placeholder factory which will look up the constituents of the multi provider.
				records.set(
					token,
					(multiProvider = <InjectedRecord>{
						token: provider.provide,
						requires: [],
						useNew: false,
						fn: COMMON_PROVIDER_FN,
						value: EMPTY,
					})
				);
			}

			token = provider;
			multiProvider.requires.push({
				token,
				options: InjectOptionFlags.Default,
			});
		}

		const record = records.get(token);

		if (record && record.fn == COMMON_PROVIDER_FN) {
			throw new Error(`Can't interop common and regular providers such as ${token}`);
		}

		records.set(token, resolvedProvider);
	} else {
		throw new Error(`Unexpected provider ${provider}`);
	}
}

export function computeRequiredDependencies(provider: StaticProvider): DependencyRecord[] {
	let deps: DependencyRecord[] = EMPTY;
	const providerDeps: any[] = (provider as ExistingProvider & StaticClassProvider & ConstructorProvider).requires;

	if (providerDeps && providerDeps.length) {
		deps = [];

		for (let i = 0; i < providerDeps.length; i++) {
			let options = InjectOptionFlags.Default;
			let token = resolveReference(providerDeps[i]);

			if (token instanceof Array) {
				for (let j = 0, annotations = token; j < annotations.length; j++) {
					const annotation = annotations[j];
					// if (annotation instanceof Optional || annotation == Optional) {
					// 	options = options | OptionFlags.Optional;
					// } else if (annotation instanceof SkipSelf || annotation == SkipSelf) {
					// 	options = options & ~OptionFlags.CheckSelf;
					// } else if (annotation instanceof Self || annotation == Self) {
					// 	options = options & ~OptionFlags.CheckParent;
					// } else if (annotation instanceof Inject) {
					// 	token = (annotation as Inject).token;
					// } else {
					// 	token = resolveReference(annotation);
					// }
					token = resolveReference(annotation);
				}
			}
			deps.push({ token, options });
		}
	} else if ((provider as ExistingProvider).useExisting) {
		const token = resolveReference((provider as ExistingProvider).useExisting);
		deps = [
			{
				token,
				options: InjectOptionFlags.Default,
			},
		];
	} else if (!providerDeps && !(USE_VALUE in provider)) {
		throw new Error(`${provider} requires dependencies`);
	}
	return deps;
}
