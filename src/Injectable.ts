import { IConstructable } from './Constructable';
import { IInjectorType } from './Injector';

export interface IInjectableType<T> extends IConstructable<T> {
	injectable: IInjectable<T>;
}

export interface IInjectable<T> {
	scope: IInjectorType<any> | 'root' | 'any' | null;
	factory: () => T;
	value: T | undefined;
}
