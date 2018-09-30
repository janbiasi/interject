import { createInjectable, PossibleInjectableDefinition, InjectableDefinition } from './Factory';

export class Token<T> {
	readonly injectable: InjectableDefinition<T> | undefined;

	constructor(protected _id: string, injectable?: PossibleInjectableDefinition<T>) {
		if (injectable !== undefined) {
			this.injectable = createInjectable({
				scope: injectable.scope || 'root',
				factory: injectable.factory,
			});
		} else {
			this.injectable = undefined;
		}
	}

	toString(): string {
		return `Token ${this._id}`;
	}
}

export interface InjectableTokenDefinition<T> extends Token<T> {
	injectable: InjectableDefinition<T> | undefined;
}
