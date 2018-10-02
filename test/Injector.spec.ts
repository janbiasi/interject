import { Injector } from '../src/Injector';
import { InjectionToken } from '../src/InjectionToken';

beforeEach(() => {
	jest.resetModules();
});

describe('Injector', () => {
	describe('basics', () => {
		it('should be creatable with providers', () => {
			const testProviderToken = new InjectionToken('testProviderToken1');
			const testProvider = {
				provide: testProviderToken,
				useValue: 10,
			};
			const injector = new Injector([testProvider]);

			expect(injector).toMatchSnapshot();
		});
	});

	describe('inheritance', () => {
		it('should resolve from parent', () => {
			const testProviderToken = new InjectionToken<number>('testProviderToken2');
			const testProvider = {
				provide: testProviderToken,
				useValue: 10,
			};
			const parentInjector = new Injector([testProvider]);
			const childInjector = new Injector([testProvider], parentInjector);
			const getServiceFromParentThruChild = childInjector.get(testProviderToken);

			expect(childInjector).toMatchSnapshot();
			expect(getServiceFromParentThruChild).toBeDefined();
			expect(getServiceFromParentThruChild).toEqual(10);
		});
	});

	describe('different providers', () => {
		describe('ValueProvider', () => {
			it('should resolve a single value from a value provider', () => {
				const testProviderToken = new InjectionToken<number>('testProviderToken3');
				const testProvider = {
					provide: testProviderToken,
					useValue: 10,
				};
				const injector = new Injector([testProvider]);

				expect(injector).toMatchSnapshot();
				expect(injector.get(testProviderToken)).toEqual(10);
			});
		});

		describe('ClassProvider', () => {
			it('should resolve a single class from a provider', () => {
				class TestService {
					static instanceCount = 0;

					constructor() {
						TestService.instanceCount++;
					}

					public get value() {
						return 'some value';
					}
				}

				const testServiceToken = new InjectionToken<TestService>('testServiceToken');
				const testProvider = {
					provide: testServiceToken,
					useClass: TestService,
				};
				const injector = new Injector([testProvider]);
				const injectedService = injector.get(testServiceToken);

				expect(injector).toMatchSnapshot();
				expect(injectedService.value).toBeDefined();
				expect(injectedService.value).toEqual('some value');
			});

			it('should resolve multiple request to the same instance', () => {
				class TestService {
					static instanceCount = 0;

					constructor() {
						TestService.instanceCount++;
					}

					public get value() {
						return 'some value';
					}
				}

				const testServiceToken = new InjectionToken<TestService>('testServiceToken');
				const testProvider = {
					provide: testServiceToken,
					useClass: TestService,
				};
				const injector = new Injector([testProvider]);
				const injectedService = injector.get(testServiceToken);
				const injectedServiceClone1 = injector.get(testServiceToken);
				const injectedServiceClone2 = injector.get(testServiceToken);

				expect(injector).toMatchSnapshot();
				expect(injectedService.value).toBeDefined();
				expect(injectedService.value).toEqual('some value');
				expect(injectedService).toMatchObject(injectedServiceClone1);
				expect(injectedService).toMatchObject(injectedServiceClone2);
				expect(TestService.instanceCount).toEqual(1);
			});
		});
	});
});
