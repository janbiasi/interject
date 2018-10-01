import { IConstructable } from './Constructable';

export interface IValueProvider {
	useValue: any;
	provide: any;
	multi?: boolean;
}

export interface IStaticClassProvider {
	useClass: IConstructable<any>;
	provide: any;
	requires: any[];
}

export interface IConstructorProvider {
	provide: IConstructable<any>;
	requires: any[];
}

export interface IExistingProvider {
	useExisting: any;
	provide: any;
}

export interface IFactoryProvider {
	useFactory: Function;
	provide: any;
}

export type StaticProvider =
	| IValueProvider
	| IExistingProvider
	| IStaticClassProvider
	| IConstructorProvider
	| IFactoryProvider;

export interface IConstructableProvider extends IConstructable<any> {}

export interface IClassProvider {
	useClass: IConstructable<any>;
	provide: any;
}

export type Provider =
	| IConstructableProvider
	| IValueProvider
	| IClassProvider
	| IConstructorProvider
	| IExistingProvider
	| IFactoryProvider;
