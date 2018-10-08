import 'reflect-metadata';
export declare const metadataKeys: {
    injectable: string;
    token: string;
    provider: string;
    injector: string;
    bootstrap: string;
};
export declare function getMetadata<T extends any>(metadataKey: any, target: any): T;
export declare function defineMetadata(metadataKey: any, metadataValue: any, target: any): void;
//# sourceMappingURL=meta.d.ts.map