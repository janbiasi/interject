import { LookupFlags } from './Flags';

export interface IInjection {
	token: any;
	factory: Function;
	useNew: boolean;
	dependencies: IInjectionDependency[];
	value: any;
	useExisting: any;
}

export interface IInjectionDependency {
	token: any;
	options: LookupFlags;
}
