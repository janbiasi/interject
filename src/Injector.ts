import { Type } from './Type';
import { Token } from './Token';
import { InjectorFlags } from './Flags';
import { StaticProvider, ValueProvider } from './Providers';
import { resolveToken, resolveProviders } from './resolvers';

export class NullInjector implements Injector {
	get(token: any, notFoundValue: any = Injector.THROW_IF_NOT_FOUND): any {
		if (notFoundValue === Injector.THROW_IF_NOT_FOUND) {
			throw new Error(`NullInjectorError: No provider for ${token}!`);
		}

		return notFoundValue;
	}
}

export const NULL_INJECTOR = new NullInjector();
export const IDENT = function<T>(value: T): T {
	return value;
};
export const EMPTY = <any[]>[];
export const CIRCULAR = IDENT;
export const COMMON_PROVIDER_FN = function(): any[] {
	return Array.prototype.slice.call(arguments);
};
export const USE_VALUE = 'useValue';

export interface InjectedRecord {
	fn: Function;
	useNew: boolean;
	requires: DependencyRecord[];
	value: any;
}

export interface DependencyRecord {
	token: any;
	options: number;
}

export type InjectorCreationOptions = {
	providers: StaticProvider[];
	parent?: Injector;
	name?: string;
};

export class StaticInjector implements Injector {
	private _records: Map<any, InjectedRecord>;

	constructor(
		providers: StaticProvider[],
		private parent: Injector = NULL_INJECTOR,
		private scope: string | null = null
	) {
		const records = (this._records = new Map<any, InjectedRecord>());
		records.set(Injector, <InjectedRecord>{
			token: Injector,
			fn: IDENT,
			requires: [],
			value: this,
			useNew: false,
		});
		// records.set(INJECTOR, <InjectedRecord>{ token: INJECTOR, fn: IDENT, deps: EMPTY, value: this, useNew: false });
		// recursivelyProcessProviders(records, providers);
		resolveProviders(records, providers);
	}

	get<T>(token: Type<T> | Token<T>, notFoundValue?: T, flags?: InjectorFlags): T;
	get(token: any, notFoundValue?: any): any;
	get(token: any, notFoundValue?: any, flags: InjectorFlags = InjectorFlags.Default): any {
		const record = this._records.get(token);
		try {
			return resolveToken({
				token,
				flags,
				record,
				notFoundValue,
				records: this._records,
				parent: this.parent,
			});
		} catch (e) {
			throw e;
		}
	}
}

export abstract class Injector {
	static THROW_IF_NOT_FOUND = new Object();
	static NULL: Injector = new NullInjector();

	abstract get<T>(token: Type<T> | Token<T>, notFoundValue?: T, flags?: InjectorFlags): T;

	static create(providers: InjectorCreationOptions): Injector;
	static create(providers: StaticProvider[] | InjectorCreationOptions, parent?: Injector): Injector {
		if (Array.isArray(providers) /* assume static providers */) {
			return new StaticInjector(providers, parent);
		} else {
			return new StaticInjector(providers.providers, providers.parent, providers.name || null);
		}
	}
}
