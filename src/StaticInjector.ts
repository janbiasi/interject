import { CommonInjector } from './Injector';
import {
	StaticProvider,
	IConstructorProvider,
	IStaticClassProvider,
	IExistingProvider,
	IFactoryProvider,
	IValueProvider,
} from './Provider';
import { IInjection, IInjectionDependency } from './InjectionItem';
import { IDENT, EMPTY, THROW_IF_NOT_FOUND, CIRCULAR } from './utils';
import { InjectionToken } from './InjectionToken';
import { IConstructable } from './Constructable';
import { InjectionLookupOptionFlags, InjectorOptionFlags } from './Flags';
import { IInjectable } from './Injectable';

export class StaticInjector implements CommonInjector {
	readonly parent: CommonInjector;
	readonly source: string | null;

	private _injections: Map<any, IInjection>;

	constructor(
		providers: StaticProvider[],
		parent: CommonInjector = CommonInjector.NULL,
		source: string | null = null
	) {
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

		// TODO: register and process providers
	}

	get<T>(token: IConstructable<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectionLookupOptionFlags): T;
	get(token: any, notFoundValue?: any): any;
	get(token: any, notFoundValue?: any, flags: InjectionLookupOptionFlags = InjectionLookupOptionFlags.Default): any {
		const record = this._injections.get(token);

		// TODO: resolve token
	}

	toString() {
		const tokens = <string[]>[];
		const records = this._injections;

		records.forEach((_, token) => tokens.push(`${token}`));

		return `StaticInjector[${tokens.join(', ')}]`;
	}
}
