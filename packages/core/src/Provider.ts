import { IConstructable } from './Constructable';
import { InjectionToken } from './InjectionToken';

export type Provide<T = any> = InjectionToken<T> | IConstructable<any>;

export interface IValueProvider {
	useValue: any;
	provide: Provide;
	multi?: boolean;
}

export interface IClassProvider {
	useClass: IConstructable<any>;
	provide: Provide;
	requires?: any[];
}

export interface IExistingProvider {
	useExisting: any;
	provide: Provide;
}

export interface IFactoryProvider {
	useFactory: Function;
	provide: Provide;
	requires?: any[];
}

export type Provider = IValueProvider | IExistingProvider | IClassProvider | IFactoryProvider;
