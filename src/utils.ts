export const IDENT = function<T>(value: T): T {
	return value;
};

export const EMPTY = <any[]>[];

export const CIRCULAR = IDENT;

export const MULTI_PROVIDER_FN = function(): any[] {
	return Array.prototype.slice.call(arguments);
};

export const THROW_IF_NOT_FOUND = Object.create(null);