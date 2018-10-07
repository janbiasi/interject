import { InjectionToken } from './InjectionToken';

export type ProviderScope = any | 'root' | null;

export const ROOT_TOKEN = new InjectionToken<boolean>('RootInjectionToken');
