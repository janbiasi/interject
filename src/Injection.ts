/**
 * Current injector value used by `inject`.
 * - `undefined`: it is an error to call `inject`
 * - `null`: `inject` can be called but there is no injector (limp-mode).
 * - Injector instance: Use the injector for resolution.
 */
let _currentInjector: any /* injector */ | undefined | null = undefined;

/**
 * Injection flags for DI.
 */
export const enum InjectFlags {
	Default = 0b0000,

	/**
	 * Specifies that an injector should retrieve a dependency from any injector until reaching the
	 * host element of the current component. (Only used with Element Injector)
	 */
	Host = 0b0001,
	/** Don't descend into ancestors of the node requesting injection. */
	Self = 0b0010,
	/** Skip the node that is requesting injection. */
	SkipSelf = 0b0100,
	/** Inject `defaultValue` instead if token not found. */
	Optional = 0b1000,
}
