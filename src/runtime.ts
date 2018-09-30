import { Injector } from './Injector';

export type RuntimeInjector = Injector | null | undefined;

let _currentRuntimeInjector: RuntimeInjector = undefined;

export function setCurrentInjector(injector: RuntimeInjector): RuntimeInjector {
	const runtimeInjector = _currentRuntimeInjector;
	_currentRuntimeInjector = injector;
	return runtimeInjector;
}
