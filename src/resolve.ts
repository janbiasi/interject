import { IInjection, IInjectionDependency } from './InjectionItem';
import { CommonInjector } from './CommonInjector';
import { InjcetionFlags, LookupFlags } from './Flags';
import { CONCAT, IDENT, THROW_IF_NOT_FOUND } from './utils';
import { Provider, IFactoryProvider, IClassProvider, IValueProvider, IExistingProvider } from './Provider';
import { InjectionToken } from '.';
import { stringify } from './utils';

export const resolveToken = (
	token: any,
	injection: IInjection | undefined,
	injections: Map<any, IInjection>,
	parent: CommonInjector,
	notFoundValue: any,
	flag: InjcetionFlags
): any => {
	let value: any;

	if (!injection || flag === InjcetionFlags.Skip) {
		// skip current injector or didn't find injection host, use parent
		return parent.get(token, notFoundValue, InjcetionFlags.Default);
	}

	if (injection.useNew && !injection.value) {
		// class was not instanciated yet, create and save the new instance
		const childDependencies = resolveTokenDependencies(injection, injections, parent);
		console.log('found deps of %s resolved to', token, childDependencies)
		value = injection.value = new (injection.factory as any)(...childDependencies);
	} else if (injection.useNew && injection.value) {
		// do nothing, class already instanciated
	} else if (typeof injection.factory === 'function' && injection.factory !== CONCAT && !injection.value) {
		// apply deps to factory and set it to the value if not already done
		const childDependencies = resolveTokenDependencies(injection, injections, parent);
		value = injection.value = injection.factory.apply(null, childDependencies);
	} else if (typeof injection.factory === 'function' && injection.factory !== CONCAT && injection.value) {
		// do nothing, factory already built
	}

	return value || injection.value;
};

export const resolveInjectableProvider = (provider: Provider, injections: Map<any, IInjection>) => {
	const token = provider.provide;
	let value: any;
	let useNew: boolean = false;
	let factory: Function;
	let dependencies: IInjectionDependency[] = [];

	if ((provider as IFactoryProvider).useFactory) {
		dependencies = (provider as IFactoryProvider).requires || [];
		factory = (provider as IFactoryProvider).useFactory;
	} else if ((provider as IClassProvider).useClass) {
		useNew = true;
		console.log((provider as IClassProvider).requires)
		dependencies = (provider as IClassProvider).requires || [];
		factory = (provider as IClassProvider).useClass;
	} else if ((provider as IValueProvider).useValue) {
		const multiProvider = injections.get(token);

		if (multiProvider && multiProvider.value) {
			value = multiProvider.factory(multiProvider.value, (provider as IValueProvider).useValue);
		} else {
			value = (provider as IValueProvider).useValue;
			factory = CONCAT;
		}
	} else if ((provider as IExistingProvider).useExisting) {
		factory = IDENT;
	}

	injections.set(token, <IInjection>{
		token,
		useNew,
		factory,
		value,
		dependencies,
	});
};

export const resolveTokenDependencies = (
	injection: IInjection,
	injections: Map<any, IInjection>,
	parent: CommonInjector = CommonInjector.NULL,
	notFoundValue: any = THROW_IF_NOT_FOUND,
	options: LookupFlags = LookupFlags.Default
): any[] => {
	let resolvedDependencies: any[] = [];

	if (injection.dependencies.length > 0) {
		for (let index = 0; index < injection.dependencies.length; index++) {
			let dependency: IInjection | undefined;
			const token = injection.dependencies[index];
			console.log('tryResolveDepsOf %s', token, injection.dependencies[index])

			if (!!~[LookupFlags.Self, LookupFlags.Default].indexOf(options)) {
				// must resolve self (which is default)
				dependency = injections.get(token);
			}

			if (options === LookupFlags.Parent) {
				// lookup parent
				// dependency = parent.get(token, notFoundValue);
			}

			if (!dependency && options !== LookupFlags.Optional && notFoundValue === THROW_IF_NOT_FOUND) {
				// throw error if not found and no default value was set
				throw new Error(`Could not resolve required dependency '${stringify(token)}'`);
			}

			if (dependency.dependencies && dependency.dependencies.length > 0) {
				console.log('foundChildDepsOf %s', token, dependency)
				dependency.dependencies = resolveTokenDependencies(dependency, injections, parent, notFoundValue);
			}

			const resolvedDependency = resolveToken(dependency.token, dependency, injections, parent, notFoundValue, InjcetionFlags.Default);
			resolvedDependencies.push(resolvedDependency);
			console.log('computedDeps of %s', token, resolvedDependencies.length, resolvedDependencies);
		}
	}

	return resolvedDependencies;
};
