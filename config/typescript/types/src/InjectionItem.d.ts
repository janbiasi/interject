import { LookupFlags } from "./Flags";
export interface IInjection {
    token: any;
    factory: Function;
    useNew: boolean;
    dependencies: IInjectionDependency[];
    value: any;
}
export interface IInjectionDependency {
    token: any;
    options: LookupFlags;
}
//# sourceMappingURL=InjectionItem.d.ts.map