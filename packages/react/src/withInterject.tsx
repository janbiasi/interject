import * as React from 'react';
import { Subtract } from './Subtract';

type InterjectModule = { new (...args: any[]): any };

interface IWithInterjectProps {
    modules: any | any[];
}

interface IWithInterjectState {}

// TODO: provide easy API for React HoC's
export function withInterject<P extends IWithInterjectProps, M extends InterjectModule>(Component: React.ComponentType<P>, modules: InterjectModule | InterjectModule[]) {
    return class InterjectionComponent extends React.Component<Subtract<P, IWithInterjectProps>, IWithInterjectState> {
        state: IWithInterjectState = {};

        render() {
            return <Component {...this.props} modules={modules} />;
        }
    }
}