import { CommonInjector, resolve } from './CommonInjector';
import { Provider, IClassProvider, IExistingProvider, IFactoryProvider, IValueProvider } from './Provider';
import { IInjection, IInjectionDependency } from './InjectionItem';
import { IDENT, EMPTY, CONCAT, THROW_IF_NOT_FOUND, CIRCULAR } from './utils';
import { InjectionToken } from './InjectionToken';
import { IConstructable } from './Constructable';
import { LookupFlags, InjcetionFlags } from './Flags';
import { IInjectable } from './Injectable';

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

		providers.forEach((provider: Provider) => {
			const token = provider.provide;
			let value: any = EMPTY;
			let useNew: boolean = false;
			let factory: Function;

			if ((provider as IFactoryProvider).useFactory) {
				factory = provider.provide;
			} else if ((provider as IClassProvider).useClass) {
				useNew = true;
				factory = (provider as IClassProvider).useClass;
			} else if ((provider as IValueProvider).useValue) {
				value = (provider as IValueProvider).useValue;
			} else if ((provider as IExistingProvider).useExisting) {
				factory = IDENT;
			}

			injections.set(token, <IInjection>{
				token,
				useNew,
				factory,
				value,
				dependencies: [],
			});
		});
	}

	get<T>(token: IConstructable<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjcetionFlags): T;
	get(token: any, notFoundValue?: any): any;
	get(token: any, notFoundValue?: any, flags: InjcetionFlags = InjcetionFlags.Default): any {
		const injection = this._injections.get(token);

		return resolve(token, injection, this._injections, this.parent, notFoundValue, flags);
	}

	toString() {
		const tokens = <string[]>[];
		const records = this._injections;

		records.forEach((_, token) => tokens.push(`${token}`));

		return `StaticInjector[${tokens.join(', ')}]`;
	}
}
