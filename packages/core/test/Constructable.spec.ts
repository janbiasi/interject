import { StaticConstructable, isConstructable } from '../src/Constructable';

describe('Constructable', () => {
	it('should check if a value is constructable', () => {
		class IsConstructable {}

		expect(isConstructable(IsConstructable)).toBe(true);
		expect(isConstructable({})).toBe(false);
		expect(isConstructable(StaticConstructable)).toBe(true);
	});
});
