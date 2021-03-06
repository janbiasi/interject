export const StaticConstructable = Function;

export function isConstructable(value: any): value is IConstructable<any> {
	return typeof value === 'function';
}

export interface IConstructable<T> {
	new (...args: any[]): T;
}
