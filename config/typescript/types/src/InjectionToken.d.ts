import { ProviderScope } from './Scope';
import { IInjectable } from './Injectable';
interface InjectionTokenOptions<T> {
    scope: ProviderScope;
    factory: () => T;
}
export declare class InjectionToken<T> {
    private readonly _id;
    readonly metadataName = "InjectionToken";
    readonly injectable: IInjectable<T>;
    constructor(_id: string, options?: InjectionTokenOptions<T>);
    toString(): string;
}
export {};
//# sourceMappingURL=InjectionToken.d.ts.map