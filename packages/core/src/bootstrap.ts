import { IConstructable } from './Constructable';
import { getMetadata, metadataKeys } from './meta';
import { CommonInjector } from './CommonInjector';
import { Provide } from './Provider';
import { InjectionToken } from './InjectionToken';

export function bootstrap<T>(ModuleFactory: IConstructable<T>): T {
	const injector: CommonInjector = getMetadata(metadataKeys.injector, ModuleFactory);
	const tokens: (InjectionToken<any> | IConstructable<any>)[] = getMetadata(metadataKeys.bootstrap, ModuleFactory);
	const providers = tokens.map((token: Provide) => injector.get(token));
	const instance = new ModuleFactory(...providers);

	return instance;
}
