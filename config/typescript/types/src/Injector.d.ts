import { CommonInjector } from './CommonInjector';
import { Provider } from './Provider';
import { IInjection } from './InjectionItem';
import { InjectionToken } from './InjectionToken';
import { IConstructable } from './Constructable';
import { InjcetionFlags } from './Flags';
export declare class Injector implements CommonInjector {
    readonly parent: CommonInjector;
    readonly source: string | null;
    private _injections;
    constructor(providers: Provider[], parent?: CommonInjector, source?: string | null);
    set(token: InjectionToken<any> | IConstructable<any>, injection: IInjection): void;
    get<T>(token: InjectionToken<any> | IConstructable<any>, notFoundValue?: T, flags?: InjcetionFlags): T;
    toString(): string;
}
//# sourceMappingURL=Injector.d.ts.map