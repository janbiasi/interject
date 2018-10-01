export interface IInjection {
	factory: Function;
	useNew: boolean;
	dependencies: IInjectionDependency[];
	value: any;
}

export interface IInjectionDependency {
	token: any;
	options: number;
}
