import { InjectionToken } from '../InjectionToken';
import * as pkg from './package.json';
import { IValueProvider } from '../Provider';

export const VersionProviderToken = new InjectionToken<string>('Defines the Version of the Platform');

export default <IValueProvider>{
	useValue: (pkg as any).version,
	provide: VersionProviderToken,
};
