import { IConstructable } from './Constructable';
import { Provider } from './Provider';
import { THROW_IF_NOT_FOUND, CONCAT, EMPTY } from './utils';
import { InjectionToken } from './InjectionToken';
import { LookupFlags, InjcetionFlags } from './Flags';
import { IInjectable } from './Injectable';
import { Injector } from './Injector';
import { IInjection } from './InjectionItem';

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

export type CommonInjectorCreateOptions =
	| Provider[]
	| {
			providers: Provider[];
			parent?: CommonInjector;
			name?: string;
	  };

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

	static create(options: CommonInjectorCreateOptions): CommonInjector;
	static create(options: CommonInjectorCreateOptions, parent?: CommonInjector): CommonInjector {
		if (Array.isArray(options)) {
			return new Injector(options, parent);
		} else {
			return new Injector(options.providers, options.parent, options.name || null);
		}
	}

	static injectable = <IInjectable<any>>{
		providedIn: 'any',
		factory: () => undefined as any,
		scope: 'root',
		value: undefined,
	};
}

export const resolve = (
	token: any,
	injection: IInjection | undefined,
	injections: Map<any, IInjection>,
	parent: CommonInjector,
	notFoundValue: any,
	flag: InjcetionFlags
): any => {
	let value: any = injection.value || undefined;

	if (flag === InjcetionFlags.Skip) {
		return parent.get(token, notFoundValue, InjcetionFlags.Default);
	}

	if (injection.useNew && injection.value === EMPTY) {
		injection.value = value = new (injection.factory as any)(...injection.dependencies);
	} else if (injection.useNew && injection.value !== EMPTY) {
		// do nothing, class already instanciated
	} else if (typeof injection.factory === 'function' && injection.factory !== CONCAT) {
		// apply deps to factory and set it to the value
		value = injection.value = injection.factory.apply(null, injection.dependencies);
	}

	return value;
};
