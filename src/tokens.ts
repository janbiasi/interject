export interface InjectDecorator {
	(token: any): any;
	new (token: any): Inject;
}

export interface Inject {
	token: any;
}

export interface OptionalDecorator {
	(): any;
	new (): Optional;
}

export interface Optional {}

export interface SelfDecorator {
	(): any;
	new (): Self;
}

export interface Self {}

export interface SkipSelfDecorator {
	(): any;
	new (): SkipSelf;
}

export interface SkipSelf {}

/**
 * Type of the Host decorator / constructor function.
 */
export interface HostDecorator {
	(): any;
	new (): Host;
}

export interface Host {}
