import { CommonInjector } from '../src/CommonInjector';
import { VersionProviderToken } from '../src/platform/providers/Version';

describe('Platform', () => {
	describe('VersionProvider', () => {
		it('should provide the current version', () => {
			const injector = CommonInjector.create({
				providers: [],
			});

			expect(injector.get(VersionProviderToken)).toEqual('0.1.0');
		});
	});
});
