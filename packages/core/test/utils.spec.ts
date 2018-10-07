import { IDENT, EMPTY, CIRCULAR, CONCAT, THROW_IF_NOT_FOUND, stringify } from '../src/utils';

describe('utils', () => {
	describe('IDENT', () => {
		it('should return the input', () => {
			expect(IDENT(10)).toEqual(10);
		});
	});

	describe('CIRCULAR', () => {
		it('should behave like IDENT to just return the input', () => {
			expect(CIRCULAR(20)).toEqual(20);
		});
	});

	describe('EMPTY', () => {
		it('should have zero length', () => {
			expect(EMPTY.length).toBeDefined();
			expect(EMPTY.length).toEqual(0);
		});
	});

	describe('CONCAT', () => {
		it('should concatenate any values', () => {
			expect(CONCAT.apply(null, [1, 2, 3])).toEqual([1, 2, 3]);
		});
	});

	describe('THROW_IF_NOT_FOUND', () => {
		it('should be defined', () => {
			expect(THROW_IF_NOT_FOUND).toBeDefined();
		});
	});

	describe('stringify', () => {
		it('should stringify undefined values', () => {
			expect(stringify(undefined)).toEqual('undefined');
			expect(stringify(null)).toEqual('undefined');
		});

		it('should stringify classes', () => {
			expect(stringify(class Test {})).toEqual('Test');
		});

		it('should stringify functions', () => {
			const anonymous = () => {};
			function named() {}

			expect(stringify(anonymous)).toEqual('anonymous');
			expect(stringify(named)).toEqual('named');
		});

		it('should stringify toString objects', () => {
			class X {
				toString() {
					return 'Class X';
				}
			}

			expect(stringify(new X())).toEqual('Class X');
		});

		it('should stringify other values', () => {
			expect(stringify(10)).toEqual('10');
			expect(stringify(NaN)).toEqual('undefined');
			expect(stringify([1,2,3])).toEqual('1,2,3');
			expect(stringify({a: 1})).toEqual('[object Object]'); // TODO: better stringify case
		})
	});
});
