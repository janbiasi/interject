import { Injectable, Module } from '../src/decorators';
import { InjectionToken } from '../src/InjectionToken';
import { bootstrap } from '../src/bootstrap';

describe('decorators', () => {
	it('should return an inject providers correctly', () => {
		@Injectable({
			scope: 'root',
		})
		class TestService {
			public get value() {
				return 10;
			}
		}

		const VALUE_TOKEN = new InjectionToken<number>('value');

		@Module({
			providers: [TestService, { provide: VALUE_TOKEN, useValue: 20 }],
		})
		class AppModule {
			constructor(private _testService: TestService, private _value: number) {}

			public get testService() {
				return this._testService;
			}

			public get value() {
				return this._value;
			}
		}
		const moduleInstance = bootstrap(AppModule);

		expect(moduleInstance).toMatchSnapshot();
		expect(moduleInstance.testService.value).toEqual(10);
		expect(moduleInstance.value).toEqual(20);
	});
});
