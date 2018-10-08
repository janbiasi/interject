/**!
 * @see https://github.com/piotrwitek/utility-types/blob/dec0bd052ed18db8cdf70eb9ed5cb6e90a8111f2/src/mapped-types.ts
 */

export type SetDifference<A, B> = A extends B ? never : A;

export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
