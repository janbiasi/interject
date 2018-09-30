import { Type } from './Type';
import {
	ValueProvider,
	ExistingProvider,
	FactoryProvider,
	ConstructorProvider,
	StaticClassProvider,
	ClassProvider,
} from './Providers';

/**
 * Specifies that the given type belongs to a certain injector:
 * - `InjectorType` such as `MyCustomModule`,
 * - `'root'` the root injector
 * - `'any'` all injectors.
 * - `null`, does not belong to any injector. Must be explicitly listed in the injector
 *   `providers`.
 */
export type InjectionScope = Type<any> | 'root' | 'any' | null;

export interface InjectableType<T> extends Type<T> {}

export interface InjectorType<T> extends Type<T> {}

export interface InjectorTypeWithProviders<T> {
	injector: InjectorType<T>;
	providers?: (
		| Type<any>
		| ValueProvider
		| ExistingProvider
		| FactoryProvider
		| ConstructorProvider
		| StaticClassProvider
		| ClassProvider
		| any[])[];
}

export interface InjectableDefinition<T> {
	scope: InjectionScope;
	factory: () => T;
	value: T | undefined;
}

export interface InjectorDefinition<T> {
	factory: () => T;
	providers: (
		| Type<any>
		| ValueProvider
		| ExistingProvider
		| FactoryProvider
		| ConstructorProvider
		| StaticClassProvider
		| ClassProvider
		| any[])[];
	imports: (InjectorType<any> | InjectorTypeWithProviders<any>)[];
}

export type PossibleInjectableDefinition<T> = {
	scope?: InjectionScope;
	factory: () => T;
};

export function createInjectable<T>(injectable: PossibleInjectableDefinition<T>) {
	return <InjectableDefinition<T>>{
		scope: injectable.scope || null,
		factory: injectable.factory,
		value: undefined,
	};
}

export type PossibleInjectorDefinition<T> = {
	factory: () => T;
	providers?: any[];
	imports?: any[];
};

export function createInjector(injector: PossibleInjectorDefinition<any>) {
	return <InjectorDefinition<any>>{
		factory: injector.factory,
		providers: injector.providers || [],
		imports: injector.imports || [],
	};
}
