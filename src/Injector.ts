import { IConstructable } from './Constructable';
import { StaticProvider } from './Provider';
import { NullInjector } from './NullInjector';
import { THROW_IF_NOT_FOUND } from './utils';
import { InjectionToken } from './InjectionToken';
import { InjectorOptionFlags } from './Flags';
import { IInjectable } from './Injectable';

export interface IInjectorType<T> extends IConstructable<T> {
	injector: IInjector<T>;
}

export interface IInjectorTypeWithProviders<T> {
	pointer: IInjectorType<T>;
	providers?: StaticProvider[];
}

export interface IInjector<T> {
	factory: () => T;
	providers: StaticProvider[];
	imports: (IInjectorType<any> | IInjectorTypeWithProviders<any>)[];
}

export type CommonInjectorCreateOptions =
	| StaticProvider[]
	| {
			providers: StaticProvider[];
			parent?: CommonInjector;
			name?: string;
	  };

export abstract class CommonInjector {
	static NULL: CommonInjector = new NullInjector();

	abstract get<T>(token: IConstructable<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectorOptionFlags): T;

	static create(options: CommonInjectorCreateOptions): CommonInjector;
	static create(options: CommonInjectorCreateOptions, parent?: CommonInjector): CommonInjector {
		if (Array.isArray(options)) {
			return new StaticInjector(options, parent);
		} else {
			return new StaticInjector(options.providers, options.parent, options.name || null);
		}
	}

	static injectable = <IInjectable<any>>{
		providedIn: 'any',
		factory: () => undefined as any,
		scope: 'root',
		value: undefined,
	};
}
