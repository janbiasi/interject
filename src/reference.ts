import { Type } from './Type';

export interface ReferenceFunction {
	(): any;
}

export function forwarder(forwareder: ReferenceFunction): Type<any> {
	(<any>forwareder).__forwarder__ = forwarder;
	(<any>forwareder).toString = function() {
		return `${this()}`;
	};

	return <Type<any>>(<any>forwareder);
}

export function resolveReference(type: any): any {
	if (typeof type === 'function' && type.hasOwnProperty('__forwarder__') && type.__forwarder__ === forwarder) {
		return (<ReferenceFunction>type)();
	} else {
		return type;
	}
}
