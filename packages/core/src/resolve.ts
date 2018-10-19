import { CommonInjector } from './CommonInjector';
import { InjcetionFlags, LookupFlags } from './Flags';
import { IInjection, IInjectionDependency } from './InjectionItem';
import { CONCAT, IDENT, THROW_IF_NOT_FOUND, stringify, CIRCULAR } from './utils';
import { Provider, IFactoryProvider, IClassProvider, IValueProvider, IExistingProvider } from './Provider';
import { IConstructable } from './Constructable';

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

	if (injection.useExisting) {
		// we should use another token to resolve the dependency, even if 
		// the token was already resolved, the dep might have changed
		value = injection.value = injections.get(injection.useExisting).value;
	} else if (injection.useNew && !injection.value) {
		// class was not instanciated yet, create and save the new instance
		const childDependencies = resolveTokenDependencies(injection, injections, parent);
		value = injection.value = new (injection.factory as IConstructable<any>)(...childDependencies);
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
	let token = provider.provide;
	let value: any;
	let useExisting: any = undefined;
	let useNew: boolean = false;
	let factory: Function;
	let dependencies: IInjectionDependency[] = [];

	if ((provider as IFactoryProvider).useFactory) {
		// provided a factory, read dependencies and set factory
		dependencies = (provider as IFactoryProvider).requires || [];
		factory = (provider as IFactoryProvider).useFactory;
	} else if ((provider as IClassProvider).useClass) {
		// provided a class as provider, set deps and factory configuration
		useNew = true;
		dependencies = (provider as IClassProvider).requires || [];
		factory = (provider as IClassProvider).useClass;
	} else if ((provider as IValueProvider).useValue) {
		// provided a simple value provider, first read existing values if we have multiple
		const multiProvider = injections.get(token);

		if (multiProvider && multiProvider.value) {
			// if we already have a value, use the factory CONCAT to concatenate with the existing values
			value = multiProvider.factory(multiProvider.value, (provider as IValueProvider).useValue);
		} else {
			// if we don't have a value set the current value as value and set the factory to concat method
			value = (provider as IValueProvider).useValue;
			factory = CONCAT;
		}
	} else if ((provider as IExistingProvider).useExisting) {
		// if we should use an exisiting one we'll use the CIRCULAR method
		factory = CIRCULAR;
		useExisting = (provider as IExistingProvider).useExisting;
	}

	injections.set(token, <IInjection>{
		token,
		useNew,
		factory,
		value,
		dependencies,
		useExisting
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
			const injectionDependency = injection.dependencies[index];

			if (!!~[LookupFlags.Self, LookupFlags.Default].indexOf(options)) {
				// must resolve self (which is default)
				dependency = injections.get(injectionDependency);
			}

			if (options === LookupFlags.Parent) {
				// lookup parent
				dependency = parent.get(injectionDependency.token, notFoundValue);
			}

			if (!dependency && options !== LookupFlags.Optional && notFoundValue === THROW_IF_NOT_FOUND) {
				// throw error if not found and no default value was set
				throw new Error(`Could not resolve required dependency '${stringify(injectionDependency)}'`);
			}

			const resolvedDependency = resolveToken(
				dependency.token,
				dependency,
				injections,
				parent,
				notFoundValue,
				InjcetionFlags.Default
			);
			resolvedDependencies.push(resolvedDependency);
		}
	}

	return resolvedDependencies;
};
