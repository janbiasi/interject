import { Injector, StaticInjector } from '../src/Injector';
import { Token } from '../src/Token';

describe('StaticInjector', () => {
	it('should be creatable without providers', () => {
		const injector = new StaticInjector([]);

		expect(injector).toMatchSnapshot();
	});

	it('should be creatable without providers and parent', () => {
		const parent = new StaticInjector([]);
		const injector = new StaticInjector([], parent);

		expect(injector).toMatchSnapshot();
	});

	it('should be creatable with value provider', () => {
		const locale = new Token<string>('locale');

		const provider = {
			provide: locale,
			useValue: 'en',
		};

		const injector = new StaticInjector([provider]);

		expect(injector).toMatchSnapshot();
		expect(injector.get(locale)).toBe('en');
	});

	it('should be creatable with multiple value providers', () => {
		const locale = new Token<string[]>('locale');

		const english = {
			provide: locale,
			useValue: 'en',
			multiple: true,
		};

		const german = {
			provide: locale,
			useValue: 'de',
			multiple: true,
		};

		const injector = new StaticInjector([english, german]);

		expect(injector).toMatchSnapshot();
		expect(injector.get(locale)).toEqual(['en', 'de']);
	});

	it('should be creatable with class provider', () => {
		class Service {
			public get value() {
				return 'test';
			}
		}

		const service = new Token<Service>('service');

		const injector = new StaticInjector([
			{
				provide: service,
				useClass: Service,
				requires: [],
			},
		]);

		expect(injector).toMatchSnapshot();
		expect(injector.get(service).value).toEqual('test');
	});
});
