import { CommonInjector } from './CommonInjector';

export type RuntimeInjectorInstance = CommonInjector | undefined | null;

let __RUNTIME_INJECTOR__: RuntimeInjectorInstance = undefined;

export const setCurrentInjector = (injector: RuntimeInjectorInstance): RuntimeInjectorInstance => {
	const formerInjector = __RUNTIME_INJECTOR__;
    __RUNTIME_INJECTOR__ = injector;
    
	return formerInjector;
}

export const getCurrentInjector = (): RuntimeInjectorInstance => __RUNTIME_INJECTOR__;