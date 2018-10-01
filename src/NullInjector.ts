import { THROW_IF_NOT_FOUND } from './utils';
import { CommonInjector } from './Injector';

export class NullInjector implements CommonInjector {
	get(token: any, notFoundValue: any = THROW_IF_NOT_FOUND): any {
		if (notFoundValue === THROW_IF_NOT_FOUND) {
			throw new Error(`NullInjectorError: No provider for ${token}!`);
		}

		return notFoundValue;
	}
}
