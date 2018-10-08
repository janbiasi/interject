import { IConstructable } from './Constructable';
import { Provider } from './Provider';
import { ProviderScope } from './Scope';
export interface IInjectableOptions {
    scope?: ProviderScope;
    requires?: Provider[];
}
export declare function Injectable({ scope, requires }?: IInjectableOptions): <T extends new (...args: any[]) => any>(Factory: T) => void;
export interface IModuleOptions {
    providers?: Array<IConstructable<any> | Provider>;
}
export declare function Module({ providers }?: IModuleOptions): <T extends new (...args: any[]) => any>(Factory: T) => void;
//# sourceMappingURL=decorators.d.ts.map