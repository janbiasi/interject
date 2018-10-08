export declare const StaticConstructable: FunctionConstructor;
export declare function isConstructable(value: any): value is IConstructable<any>;
export interface IConstructable<T> {
    new (...args: any[]): T;
}
//# sourceMappingURL=Constructable.d.ts.map