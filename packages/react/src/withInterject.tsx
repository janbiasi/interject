import * as React from 'react';
import { Subtract } from './Subtract';
import { internalBootstrapFactory } from '@interject/core';
import { getAnchorProp } from './utils';

export type InterjectModule<T extends any> = { new (...args: any[]): T };

export interface IWithInterjectProps {
    [moduleProvideToken: string]: any;
}

export interface IWithInterjectState {}

export interface IInterjectComponentPersistance {
    providers: any[];
}

/** @internal */
const modulePersistanceMap: Map<InterjectModule<any>, IInterjectComponentPersistance> = new Map();

export function withInterject<T extends InterjectModule<any>, P extends IWithInterjectProps>(Component: React.ComponentType<P>, ModuleFactory?: T) {
    return class InterjectionComponent extends React.Component<Subtract<P, IWithInterjectProps>, IWithInterjectState> {
        state: IWithInterjectState = {};

        aggreagateModuleInstance(ModuleFactory?: InterjectModule<any>) {
            if (!ModuleFactory) {
                return null;
            }

            const cached = modulePersistanceMap.get(ModuleFactory);
            if (cached) {
                return cached;
            }

            const bootstrappedModule = internalBootstrapFactory(ModuleFactory);
            modulePersistanceMap.set(ModuleFactory, bootstrappedModule);
            return bootstrappedModule;
        }

        render() {
            if (!ModuleFactory) {
                return <Component {...this.props}/>;
            }

            const inst = this.aggreagateModuleInstance(ModuleFactory);
            const key = getAnchorProp(inst);
            const injectedModuleProps = {
                [key]: inst
            };
            
            return <Component {...this.props} {...injectedModuleProps} />;
            
        }
    }
}