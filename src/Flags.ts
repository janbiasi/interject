export const enum InjectionLookupOptionFlags {
	Optional = 0,
	CheckSelf = 1,
	CheckParent = 2,
	Default = 3,
}

export const enum InjectorOptionFlags {
	Default = 0,
	Host = 1,
	Self = 2,
	SkipSelf = 3,
	Optional = 4,
}
