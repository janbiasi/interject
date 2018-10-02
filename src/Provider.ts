import { IConstructable } from './Constructable';

export interface IValueProvider {
	useValue: any;
	provide: any;
	multi?: boolean;
}

export interface IClassProvider {
	useClass: IConstructable<any>;
	provide: any;
	requires?: any[];
}

export interface IExistingProvider {
	useExisting: any;
	provide: any;
}

export interface IFactoryProvider {
	useFactory: Function;
	provide: any;
}

export type Provider = IValueProvider | IExistingProvider | IClassProvider | IFactoryProvider;
