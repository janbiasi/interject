export function IDENT<T>(value: T): T {
	return value;
}

export const EMPTY = <any[]>[];

export const CIRCULAR = IDENT;

export function CONCAT(): any[] {
	return Array.prototype.slice.call(arguments);
}

export const THROW_IF_NOT_FOUND = Object.create(null);

export function stringify(value: any): string {
	if (!value) {
		return 'undefined';
	}

	if ((value.constructor && value.name) || typeof value === 'function') {
		return value.name;
	} else if (typeof value.toString === 'function') {
		return value.toString();
	}

	return `${value}`;
}
