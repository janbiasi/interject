import { Injector } from '../src/Injector';
import { InjectionToken } from '../src/InjectionToken';

beforeEach(() => {
	jest.resetModules();
});

describe('Injector', () => {
	describe('basics', () => {
		it('should be creatable without providers', () => {
			const injector = new Injector([]);
			expect(injector).toMatchSnapshot();
		});

		it('should be creatable with providers', () => {
			const testProviderToken = new InjectionToken('withProvidersToken');
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
			const testProviderToken = new InjectionToken<number>('inheritProviderToken');
			const testProvider = {
				provide: testProviderToken,
				useValue: 10,
			};
			const parentInjector = new Injector([testProvider]);
			const childInjector = new Injector([testProvider], parentInjector);
			const getServiceFromParentThruChild = childInjector.get(testProviderToken);

			expect(childInjector).toMatchSnapshot();
			expect(childInjector.toString()).toMatchSnapshot();
			expect(getServiceFromParentThruChild).toBeDefined();
			expect(getServiceFromParentThruChild).toEqual(10);
		});
	});

	describe('specific providers', () => {
		describe('ValueProvider', () => {
			it('should resolve a single value from a value provider', () => {
				const testProviderToken = new InjectionToken<number>('valueProviderToken');
				const testProvider = {
					provide: testProviderToken,
					useValue: 10,
				};
				const injector = new Injector([testProvider]);

				expect(injector).toMatchSnapshot();
				expect(injector.toString()).toMatchSnapshot();
				expect(injector.get(testProviderToken)).toEqual(10);
			});

			it('should resolve multiple values from a value provider', () => {
				const testProviderToken = new InjectionToken<number>('multiProviderToken');
				const testProvider = {
					provide: testProviderToken,
					useValue: 10,
				};
				const anotherTestProvider = {
					provide: testProviderToken,
					useValue: 20,
				};
				const injector = new Injector([testProvider, anotherTestProvider]);

				expect(injector).toMatchSnapshot();
				expect(injector.toString()).toMatchSnapshot();
				expect(injector.get(testProviderToken)).toEqual([10, 20]);
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

				const testServiceToken = new InjectionToken<TestService>('classProviderToken');
				const testProvider = {
					provide: testServiceToken,
					useClass: TestService,
				};
				const injector = new Injector([testProvider]);
				const injectedService = injector.get(testServiceToken);

				expect(injector).toMatchSnapshot();
				expect(injector.toString()).toMatchSnapshot();
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

				const testServiceToken = new InjectionToken<TestService>('singletonClassProviderToken');
				const testProvider = {
					provide: testServiceToken,
					useClass: TestService,
				};
				const injector = new Injector([testProvider]);
				const injectedService = injector.get(testServiceToken);
				const injectedServiceClone1 = injector.get(testServiceToken);
				const injectedServiceClone2 = injector.get(testServiceToken);

				expect(injector).toMatchSnapshot();
				expect(injector.toString()).toMatchSnapshot();
				expect(injectedService.value).toBeDefined();
				expect(injectedService.value).toEqual('some value');
				expect(injectedService).toMatchObject(injectedServiceClone1);
				expect(injectedService).toMatchObject(injectedServiceClone2);
				expect(TestService.instanceCount).toEqual(1);
			});
		});

		describe('FactoryProvider', () => {
			it('should resolve the factory value correctly', () => {
				const testFactoryToken = new InjectionToken<{value: string}>('factoryProviderToken');
				const testFactory = () => ({
						value: ['value']
				});
				const testFactoryProvider = {
					provide: testFactoryToken,
					useFactory: testFactory
				};
				const injector = new Injector([testFactoryProvider]);
				const result = injector.get(testFactoryToken);

				expect(injector).toMatchSnapshot();
				expect(result.value).toEqual(['value']);
			})

			it('should execute the factory only once', () => {
				const testFactoryToken = new InjectionToken<{value: string}>('multiFactoryProviderToken');
				let factoryCreationCounter = 0;
				const testFactory = () => {
					factoryCreationCounter++;
					return { value: ['value'] };
				};
				const testFactoryProvider = {
					provide: testFactoryToken,
					useFactory: testFactory
				};
				const injector = new Injector([testFactoryProvider]);
				const firstGet = injector.get(testFactoryToken);
				const secondGet = injector.get(testFactoryToken);
				const thirdGet = injector.get(testFactoryToken);

				expect(injector).toMatchSnapshot();
				expect(firstGet.value).toEqual(['value']);
				expect(secondGet.value).toEqual(['value']);
				expect(thirdGet.value).toEqual(['value']);
				expect(factoryCreationCounter).toEqual(1);
			})
		})
	});
});
