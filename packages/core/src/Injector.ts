import { CommonInjector } from './CommonInjector';
import { Provider } from './Provider';
import { IInjection } from './InjectionItem';
import { EMPTY, CIRCULAR, stringify } from './utils';
import { InjectionToken } from './InjectionToken';
import { IConstructable } from './Constructable';
import { InjcetionFlags } from './Flags';
import { resolveToken, resolveInjectableProvider } from './resolve';
import { setCurrentInjector } from './runtime';

export class Injector implements CommonInjector {
	readonly parent: CommonInjector;
	readonly source: string | null;

	private _injections: Map<any, IInjection>;

	constructor(providers: Provider[], parent: CommonInjector = CommonInjector.NULL, source: string | null = null) {
		this.parent = parent;
		this.source = source;

		// enable runtime features and closure scoping
		setCurrentInjector(this);

		// storage for all injectables
		const injections = (this._injections = new Map<any, IInjection>());

		// set an injection point to the common injector
		injections.set(CommonInjector, <IInjection>{
			token: CommonInjector,
			factory: CIRCULAR,
			dependencies: EMPTY,
			value: this,
			useNew: false,
		});

		// process all providers
		providers.forEach((provider: Provider) => resolveInjectableProvider(provider, injections));
	}

	set(token: InjectionToken<any> | IConstructable<any>, injection: IInjection): void {
		this._injections.set(token, injection);
	}

	get<T>(token: InjectionToken<any> | IConstructable<any>, notFoundValue?: T, flags?: InjcetionFlags): T {
		const injection = this._injections.get(token);

		// resolve the token and its dependencies
		return resolveToken(token, injection, this._injections, this.parent, notFoundValue, flags);
	}

	toString() {
		const tokens: string[] = [];
		this._injections.forEach((key, token) => tokens.push(stringify(token)));

		return `Injector { ${tokens.join(', ')} }`;
	}
}
