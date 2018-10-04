export const IDENT = function<T>(value: T): T {
	return value;
};

export const EMPTY = <any[]>[];

export const CIRCULAR = IDENT;

export const CONCAT = function(): any[] {
	return Array.prototype.slice.call(arguments);
};

export const THROW_IF_NOT_FOUND = Object.create(null);

export const stringify = (value: any): string => {
	if(!value) {
		return 'undefined';
	}

	if((value.constructor && value.name) || typeof value === 'function') {
		return value.name;
	} else if (typeof value.toString === 'function') {
		return value.toString();
	}

	return `${value}`;
};
