import { InjectionToken } from '../src/InjectionToken';

describe('InjectionToken', () => {
	it('should be creatable', () => {
		const token = new InjectionToken('creatable');

		expect(token).toMatchSnapshot();
		expect(token.toString()).toEqual('InjectionToken creatable');
		expect(token.injectable).toBeDefined();
		expect(token.injectable.factory()).toBe(undefined);
		expect(token.injectable.scope).toEqual('root');
	});

	it('should be creatable with options', () => {
		const token = new InjectionToken<null>('withOptions', {
			scope: 'custom-scope',
			factory: () => null,
		});

		expect(token).toMatchSnapshot();
		expect(token.toString()).toEqual('InjectionToken@custom-scope withOptions');
		expect(token.injectable).toBeDefined();
		expect(token.injectable.factory()).toBe(null);
		expect(token.injectable.scope).toEqual('custom-scope');
	});
});
