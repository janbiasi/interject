import { IConstructable } from './Constructable';
import { Provider } from './Provider';
import { InjectionToken } from './InjectionToken';
import { InjcetionFlags } from './Flags';
import { IInjectable } from './Injectable';
export interface IInjectorType<T> extends IConstructable<T> {
    injector: IInjector<T>;
}
export interface IInjectorTypeWithProviders<T> {
    pointer: IInjectorType<T>;
    providers?: Provider[];
}
export interface IInjector<T> {
    factory: () => T;
    providers: Provider[];
    imports: (IInjectorType<any> | IInjectorTypeWithProviders<any>)[];
}
export interface ICommonInjectorCreateOptions {
    providers: Provider[];
    parent?: CommonInjector;
    name?: string;
}
export declare class NullInjector implements CommonInjector {
    get(token: any, notFoundValue?: any): any;
}
export declare abstract class CommonInjector {
    static NULL: CommonInjector;
    static THROW_IF_NOT_FOUND: any;
    abstract get<T>(token: IConstructable<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjcetionFlags): T;
    static create(options: ICommonInjectorCreateOptions): CommonInjector;
    static injectable: IInjectable<any>;
    static toString(): string;
    static readonly currentInjector: CommonInjector;
}
//# sourceMappingURL=CommonInjector.d.ts.map