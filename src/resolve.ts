import { IInjection } from "./InjectionItem";
import { CommonInjector } from "./CommonInjector";
import { InjcetionFlags } from "./Flags";
import { CONCAT, IDENT } from "./utils";
import { Provider, IFactoryProvider, IClassProvider, IValueProvider, IExistingProvider } from "./Provider";

export const resolveToken = (
	token: any,
	injection: IInjection | undefined,
	injections: Map<any, IInjection>,
	parent: CommonInjector,
	notFoundValue: any,
	flag: InjcetionFlags
): any => {
	let value: any

	if(!injection || flag === InjcetionFlags.Skip) {
		// skip current injector or didn't find injection host, use parent
		return parent.get(token, notFoundValue, InjcetionFlags.Default);
	}

	if (injection.useNew && !injection.value) {
		// class was not instanciated yet, create and save the new instance
		// TODO: compute required dependencies
		value = injection.value = new (injection.factory as any)(...injection.dependencies);
	} else if (injection.useNew && injection.value) {
		// do nothing, class already instanciated
	} else if (typeof injection.factory === 'function' && injection.factory !== CONCAT && !injection.value) {
		// apply deps to factory and set it to the value if not already done
		value = injection.value = injection.factory.apply(null, []);
	} else if (typeof injection.factory === 'function' && injection.factory !== CONCAT && injection.value) {
		// do nothing, factory already built
	}

	return value || injection.value;
};

export const resolveInjectableProvider = (provider: Provider, injections: Map<any, IInjection>) => {
	const token = provider.provide;
			let value: any;
			let useNew: boolean = false;
			let factory: Function;


			if ((provider as IFactoryProvider).useFactory) {
				factory = (provider as IFactoryProvider).useFactory;
			} else if ((provider as IClassProvider).useClass) {
				useNew = true;
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
				dependencies: [],
			});
}