import * as pkg from '../../../package.json';
import { IValueProvider } from '../../Provider';
import { InjectionToken } from '../../InjectionToken';

/**
 * This provider will be used to check compatibility between
 * the plugins for other frameworks and the core itself.
 */

export const VersionProviderToken = new InjectionToken<string>('version');

export default <IValueProvider>{
	useValue: (pkg as any).version,
	provide: VersionProviderToken,
};
