import { ProviderScope } from './Scope';
import { IInjectable } from './Injectable';

interface InjectionTokenOptions<T> {
	scope: ProviderScope;
	factory: () => T;
}

export class InjectionToken<T> {
	readonly metadataName = 'InjectionToken';
	readonly injectable: IInjectable<T>;

	constructor(private readonly _id: string, options: InjectionTokenOptions<T>) {
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
