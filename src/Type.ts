/**
 * Represents a type that a Component or other object is instances of.
 * An example of a `Type` is `MyCustomComponent` class, which in JavaScript is be represented by
 * the `MyCustomComponent` constructor function.
 */

export const Type = Function;

export function isType(value: any): value is Type<any> {
	return typeof value === 'function';
}

export interface Type<T> extends Function {
	new (...args: any[]): T;
}
