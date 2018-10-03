import { IDENT, EMPTY, CIRCULAR, CONCAT, THROW_IF_NOT_FOUND } from '../src/utils';

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
});
