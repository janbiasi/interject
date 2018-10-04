import { Injectable, Module } from '../src/decorators';
import { Injector } from '../src/Injector';
import { getMetadata, metadataKeys } from '../src/meta';
import { InjectionToken } from '../src/InjectionToken';

describe('decorators', () => {
	describe('@Injectable', () => {
		it('should return an injectable provider from a class', () => {
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
			class AppModule {}

			console.log(new AppModule());
		});
	});
});
