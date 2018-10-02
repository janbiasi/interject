import { ProviderScope } from './Scope';
import { IInjectable } from './Injectable';

interface InjectionTokenOptions<T> {
	scope: ProviderScope;
	factory: () => T;
}

const INJECTION_TOKEN_DEFAULT_OPTIONS = {
	scope: 'root',
	factory: () => undefined,
};

export class InjectionToken<T> {
	readonly metadataName = 'InjectionToken';
	readonly injectable: IInjectable<T>;

	constructor(private readonly _id: string, options: InjectionTokenOptions<T> = INJECTION_TOKEN_DEFAULT_OPTIONS) {
		this.injectable = {
			scope: options.scope,
			factory: options.factory,
			value: undefined,
		};
	}

	toString() {
		return `InjectionToken { ${this._id} }`;
	}
}
