import { IConstructable } from './Constructable';
import { IClassProvider, Provider } from './Provider';
import { InjectionToken } from './InjectionToken';
import { ProviderScope } from './Scope';
import { IInjectableType, IInjectable } from './Injectable';
import { defineMetadata, metadataKeys, getMetadata } from './meta';
import { Injector, CommonInjector } from '.';

export interface IInjectableOptions {
	scope?: ProviderScope;
	requires?: Provider[];
}

const INJECTABLE_DEFAULT_OPTS = {
	scope: 'root',
	requires: [],
};

export function Injectable({ scope, requires }: IInjectableOptions = INJECTABLE_DEFAULT_OPTS) {
	return <T extends { new (...args: any[]): any }>(Factory: T) => {
		const token = new InjectionToken<T>(Factory.name);
		const injectable = <IInjectable<T>>{
			scope,
			requires,
			factory: Factory as any,
			value: undefined,
		};

		defineMetadata(metadataKeys.token, token, Factory);
		defineMetadata(metadataKeys.injectable, injectable, Factory);
	};
}

export interface IModuleOptions {
	providers?: Array<IConstructable<any>|Provider>;
}

const MODULE_DEFAULT_OPTS = {
	providers: [],
};

export function Module({ providers }: IModuleOptions = MODULE_DEFAULT_OPTS) {
	return <T extends { new (...args: any[]): any }>(Factory: T) => {
		const processedProviders: Provider[] = providers.map(
			(provider: any): Provider => {
				if (typeof provider === 'function') {
					return {
						provide: getMetadata(metadataKeys.token, provider),
						useClass: getMetadata(metadataKeys.provider, provider),
					};
				}

				return provider as Provider;
			}
		);
        
        console.log('create injector');
        const injector = new Injector(processedProviders, CommonInjector.NULL, Factory.name);
        console.log(injector)

		defineMetadata(metadataKeys.injector, injector, Factory);
	};
}
