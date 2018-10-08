import { IConstructable } from './Constructable';
import { IInjectorType } from './CommonInjector';
export interface IInjectableType<T> extends IConstructable<T> {
    injectable: IInjectable<T>;
}
export interface IInjectable<T> {
    scope: IInjectorType<any> | 'root' | 'any' | null;
    factory: () => T;
    value: T | undefined;
}
//# sourceMappingURL=Injectable.d.ts.map