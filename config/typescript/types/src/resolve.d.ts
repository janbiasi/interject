import { CommonInjector } from './CommonInjector';
import { InjcetionFlags, LookupFlags } from './Flags';
import { IInjection } from './InjectionItem';
import { Provider } from './Provider';
export declare const resolveToken: (token: any, injection: IInjection, injections: Map<any, IInjection>, parent: CommonInjector, notFoundValue: any, flag: InjcetionFlags) => any;
export declare const resolveInjectableProvider: (provider: Provider, injections: Map<any, IInjection>) => void;
export declare const resolveTokenDependencies: (injection: IInjection, injections: Map<any, IInjection>, parent?: CommonInjector, notFoundValue?: any, options?: LookupFlags) => any[];
//# sourceMappingURL=resolve.d.ts.map