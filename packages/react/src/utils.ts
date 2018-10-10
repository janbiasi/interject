import { IConstructable } from "@interject/core/dist/meta/src/Constructable";

export type ReactProvidableModule = {
    provideAs?: string
}

export const getAnchorProp = (Factory: IConstructable<any>): string => {
    if (typeof (<ReactProvidableModule>Factory).provideAs === 'string') {
        return (<ReactProvidableModule>Factory).provideAs;
    }

    return Factory.toString();
}