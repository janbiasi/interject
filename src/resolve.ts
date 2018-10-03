import { IInjection } from "./InjectionItem";
import { CommonInjector } from "./CommonInjector";
import { InjcetionFlags } from "./Flags";
import { CONCAT } from "./utils";

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

	value = value || injection.value;

	return value;
};
