import { IConstructable } from './Constructable';
import { Provider } from './Provider';
import { THROW_IF_NOT_FOUND } from './utils';
import { InjectionToken } from './InjectionToken';
import { InjcetionFlags } from './Flags';
import { IInjectable } from './Injectable';
import { Injector } from './Injector';

// runtime
import { setCurrentInjector, getCurrentInjector } from './runtime';

// core providers
import VersionProvider from './platform/providers/Version';

export interface IInjectorType<T> extends IConstructable<T> {
	injector: IInjector<T>;
}

export interface IInjectorTypeWithProviders<T> {
	pointer: IInjectorType<T>;
	providers?: Provider[];
}

export interface IInjector<T> {
	factory: () => T;
	providers: Provider[];
	imports: (IInjectorType<any> | IInjectorTypeWithProviders<any>)[];
}

export interface ICommonInjectorCreateOptions {
	providers: Provider[];
	parent?: CommonInjector;
	name?: string;
}

export class NullInjector implements CommonInjector {
	get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
		if (notFoundValue === THROW_IF_NOT_FOUND) {
			throw new Error(`NullInjectorError: No provider for ${token}!`);
		}

		return notFoundValue;
	}
}

export abstract class CommonInjector {
	static NULL: CommonInjector = new NullInjector();
	static THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;

	abstract get<T>(token: IConstructable<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjcetionFlags): T;

	static create(options: ICommonInjectorCreateOptions): CommonInjector {
		// add core providers
		options.providers.push(VersionProvider);

		return new Injector(options.providers, options.parent, options.name || null);
	}

	static injectable = <IInjectable<any>>{
		providedIn: 'any',
		factory: () => undefined as any,
		scope: 'root',
		value: undefined,
	};

	static toString() {
		return `CommonInjector`;
	}

	static get currentInjector(): CommonInjector {
		return getCurrentInjector();
	}
}
