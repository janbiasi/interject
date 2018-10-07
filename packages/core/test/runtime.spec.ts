import { getCurrentInjector, setCurrentInjector } from '../src/runtime';
import { CommonInjector } from '../src';

describe('runtime', () => {
	it('should return null if no injector was created', () => {
		expect(getCurrentInjector()).toBeUndefined();
	});

	it('should return the last injector when available', () => {
		const injector = CommonInjector.create({
			providers: [],
		});

		expect(getCurrentInjector()).toEqual(injector);
	});

	describe('t', () => {
		it('should be manually overridable', () => {
			// TODO: jest.resetModules() doesn't work here!
			setCurrentInjector(undefined);
			expect(getCurrentInjector()).toBeUndefined();
			setCurrentInjector(CommonInjector.NULL);
			expect(getCurrentInjector()).toEqual(CommonInjector.NULL);
		});
	});
});
