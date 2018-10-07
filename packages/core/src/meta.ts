import 'reflect-metadata';

export const enum TypeDeclaration {
	Component = 'Component',
}

export const metadataKeys = {
	injectable: 'custom:injectable',
	token: 'custom:token',
	provider: 'custom:provider',
	injector: 'custom:injector',
	bootstrap: 'custom:bootstrap',
};

export function getMetadata<T extends any>(metadataKey: any, target: any): T {
	return Reflect.getMetadata(metadataKey, target);
}

export function defineMetadata(metadataKey: any, metadataValue: any, target: any): void {
	Reflect.defineMetadata(metadataKey, metadataValue, target);
}
