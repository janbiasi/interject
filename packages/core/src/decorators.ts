import { IConstructable } from './Constructable';
import { IClassProvider, Provider } from './Provider';
import { InjectionToken } from './InjectionToken';
import { ProviderScope } from './Scope';
import { IInjectableType, IInjectable } from './Injectable';
import { defineMetadata, metadataKeys, getMetadata } from './meta';
import { Injector, CommonInjector } from '.';
import { stringify } from './utils';

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
		const token = new InjectionToken<T>(Factory.name || stringify(Factory));
		const injectable = <IInjectable<T>>{
			scope,
			requires,
			useNew: true,
			factory: Factory as any,
			value: undefined,
		};

		defineMetadata(metadataKeys.token, token, Factory);
		defineMetadata(metadataKeys.injectable, injectable, Factory);
	};
}

export interface IModuleOptions {
	providers?: Array<IConstructable<any> | Provider>;
	parent?: CommonInjector
}

const MODULE_DEFAULT_OPTS = {
	providers: [],
};

/** @internal */
export function internalModuleDecoratorFactory<T extends IConstructable<any>>(
	{ providers, parent }: IModuleOptions,
	Factory: T
): CommonInjector {
	const processedProviders: Provider[] = providers.map(
		(provider: any): Provider => {
			if (typeof provider === 'function') {
				return {
					provide: getMetadata(metadataKeys.token, provider),
					useClass: provider,
				};
			}

			return provider as Provider;
		}
	);

	// create module root injector without parent
	// TODO: let module inherit from other module for correct resolving of inherited deps
	const injector = CommonInjector.create({
		providers: processedProviders,
		parent: parent || CommonInjector.NULL,
		name: Factory.name,
	});

	defineMetadata(metadataKeys.injector, injector, Factory);
	defineMetadata(
		metadataKeys.bootstrap,
		// the tokens in correct order for bootstrap of the module
		processedProviders.map((provider: Provider) => provider.provide),
		Factory
	);

	return injector;
}

export function Module({ providers, parent }: IModuleOptions = MODULE_DEFAULT_OPTS) {
	return <T extends { new (...args: any[]): any }>(Factory: T) => {
		internalModuleDecoratorFactory({
			providers,
			parent
		}, Factory);
	};
}
