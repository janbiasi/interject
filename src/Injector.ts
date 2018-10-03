import { CommonInjector } from './CommonInjector';
import { Provider, IClassProvider, IExistingProvider, IFactoryProvider, IValueProvider } from './Provider';
import { IInjection } from './InjectionItem';
import { IDENT, EMPTY, CONCAT } from './utils';
import { InjectionToken } from './InjectionToken';
import { IConstructable } from './Constructable';
import { InjcetionFlags } from './Flags';
import { resolveToken, resolveInjectableProvider } from './resolve';

export class Injector implements CommonInjector {
	readonly parent: CommonInjector;
	readonly source: string | null;

	private _injections: Map<any, IInjection>;

	constructor(providers: Provider[], parent: CommonInjector = CommonInjector.NULL, source: string | null = null) {
		this.parent = parent;
		this.source = source;
		const injections = (this._injections = new Map<any, IInjection>());

		injections.set(CommonInjector, <IInjection>{
			token: CommonInjector,
			factory: IDENT,
			dependencies: EMPTY,
			value: this,
			useNew: false,
		});

		providers.forEach((provider: Provider) => resolveInjectableProvider(provider, injections));
	}

	get<T>(token: IConstructable<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjcetionFlags): T;
	get(token: any, notFoundValue?: any): any;
	get(token: any, notFoundValue?: any, flags: InjcetionFlags = InjcetionFlags.Default): any {
		const injection = this._injections.get(token);

		return resolveToken(token, injection, this._injections, this.parent, notFoundValue, flags);
	}

	toString() {
		const tokens: string[] = [];
		this._injections.forEach((key, token) => tokens.push(token.toString()));

		return `Injector { ${tokens.join(', ')} }`;
	}
}
