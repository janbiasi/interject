import { resolveToken } from '../src/resolve';
import { Injector } from '../src/Injector';
import { InjectionToken } from '../src/InjectionToken';
import { IInjection } from '../src/InjectionItem';
import { InjcetionFlags } from '../src/Flags';

const EMPTY_INJECTION_MAP = new Map<any, IInjection>();
const DEFAULT_INJECTION_FLAG = InjcetionFlags.Default;

beforeEach(() => {
	jest.resetModules();
});

describe('resolve', () => {
	describe('token', () => {
		it('should throw an error if token cant be resolved', () => {
			const token = new InjectionToken<any>('unavailableTestToken');
			const injector = new Injector([]);

			const tryResolveToken = () => {
				// will fail as the token is whether registered to the injection map
				// nor to the injector itself or any parent injector
				resolveToken(
					token,
					undefined,
					EMPTY_INJECTION_MAP,
					injector,
					undefined,
					DEFAULT_INJECTION_FLAG
				);
			};

			expect(tryResolveToken).toThrowError();
		});

		it('should resolve a value provider correctly', () => {
			const token = new InjectionToken<number>('provider');
			const injector = new Injector([{ useValue: 10, provide: token }]);
			const injection = {
				token,
				useNew: false,
				factory: () => undefined,
				value: 10,
				dependencies: [],
			};

			const resolvedValue = resolveToken(
				token,
				injection,
				EMPTY_INJECTION_MAP,
				injector,
				undefined,
				DEFAULT_INJECTION_FLAG
			);

			expect(resolvedValue).toEqual(10);
		});
	});
});
