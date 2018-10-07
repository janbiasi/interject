import { InjectionToken } from '../src/InjectionToken';
import { Injector } from '../src/Injector';
import { NullInjector, CommonInjector } from '../src/CommonInjector';

const NULL_PROVIDER_TOKEN = new InjectionToken<null>('null-provider');

describe('CommonInjector', () => {
	it('should provide a static NullInjector', () => {
		expect(CommonInjector.NULL).toBeInstanceOf(NullInjector);
	});

	it('should provide a default injectable definition', () => {
		expect(CommonInjector.injectable).toBeDefined();
		expect(CommonInjector.injectable.value).toBe(undefined);
		expect(CommonInjector.injectable.scope).toEqual('root');
		expect(typeof CommonInjector.injectable.factory).toEqual('function');
		expect(CommonInjector.injectable.factory()).toBe(undefined);
	});

	it('should create a single option-ish Injector statically', () => {
		const simpleProviderToken = new InjectionToken<number>('simpleProviderToken');
		const withoutProviders = CommonInjector.create({
			providers: [{ provide: simpleProviderToken, useValue: 20 }],
			name: 'RootInjector',
			parent: CommonInjector.NULL,
		});

		expect(withoutProviders).toMatchSnapshot();
		expect(withoutProviders.toString()).toEqual(
			'Injector { CommonInjector, InjectionToken simpleProviderToken, InjectionToken version }'
		);
	});

	describe('NullInjector', () => {
		it('should throw an error in default case', () => {
			const nuller = new NullInjector();

			expect(() => {
				nuller.get(NULL_PROVIDER_TOKEN);
			}).toThrow('NullInjectorError: No provider for InjectionToken null-provider!');
		});

		it('should provide the defalt value given', () => {
			const nuller = new NullInjector();

			expect(nuller.get(NULL_PROVIDER_TOKEN, 10)).toBe(10);
		});

		it('should be used inside every injector as fallback', () => {
			const missingProviderToken = new InjectionToken('missingProviderToken');
			const injector = new Injector([]);

			expect(() => {
				injector.get(missingProviderToken);
			}).toThrow('NullInjectorError: No provider for InjectionToken missingProviderToken!');
		});
	});
});
