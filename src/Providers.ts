import { Type } from './Type';

/**
 * There are two types of providers; Absent and normal ones. The absent providers are used for
 * existing providers which don't have a provided value. It will be taken from the injector itself.
 *
 * Description of multiple properties:
 * provide:
 * 	- An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
 * multiple:
 * 	- If true, then injector returns an array of instances.
 * 	- This is useful to allow multiple providers spread across many files to provide
 * 	  configuration information to a multiple token.
 * requires:
 * 	- define what the provider requires
 * 	- can be anything, we'll throw an error if can't resolve it
 * use<Definition>:
 * 	- declares what the provider should use, e.G. useClass => class, useFactory = Function etc.
 */

export interface ValueAbsentProvider {
	useValue: any;
}

export interface ValueProvider extends ValueAbsentProvider {
	provide: any;
	multiple?: boolean;
}

export interface StaticClassAbsentProvider {
	useClass: Type<any>;
	requires: any[];
}

export interface StaticClassProvider extends StaticClassAbsentProvider {
	provide: any;
	multiple?: boolean;
}

export interface ConstructorAbsentProvider {
	requires?: any[];
}

export interface ConstructorProvider extends ConstructorAbsentProvider {
	provide: Type<any>;
	multiple?: boolean;
}

export interface ExistingAbsentProvider {
	useExisting: any;
}

export interface ExistingProvider extends ExistingAbsentProvider {
	provide: any;
	multiple?: boolean;
}

export interface FactoryAbsentProvider {
	useFactory: Function;
	requires?: any[];
}

export interface FactoryProvider extends FactoryAbsentProvider {
	provide: any;
	multiple?: boolean;
}

export interface ClassAbsentProvider {
	useClass: Type<any>;
}

export interface ClassProvider extends ClassAbsentProvider {
	provide: any;
	multi?: boolean;
}

export interface TypeProvider extends Type<any> {}

export type StaticProvider =
	| ValueProvider
	| ExistingProvider
	| StaticClassProvider
	| ConstructorProvider
	| FactoryProvider
	| any[];

export type Provider =
	| TypeProvider
	| ValueProvider
	| ClassProvider
	| ConstructorProvider
	| ExistingProvider
	| FactoryProvider
	| any[];
