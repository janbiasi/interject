export type ReactProvidableModule = {
	provideAs?: string;
};

export const getAnchorProp = (Factory: { new (...args: any[]): any }): string => {
	if (typeof (<ReactProvidableModule>Factory).provideAs === 'string') {
		return (<ReactProvidableModule>Factory).provideAs;
	}

	return Factory.toString();
};
