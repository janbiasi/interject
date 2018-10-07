## Idea and use-case
This framework is inspired by Angular's dependency injection concept but it's far more lightweight and smaller without all the features and not exactly the same regarding the usage and concept.

## Core principals
tbd.

### Definining injectables

Each injectable is defined with a key. The key is not only a string, it's rather a token. Inside the interject framework they're called `InjectionToken`. The key can also be any type of constructable class (not object!). Dependencies defined by a token are registered inside an Injector which then can be provided by a method called `get`. The dependency will automatically be instanciated/called/exposed by the injector and provided to your module.

## Providers

* [ClassProvider](#class-provider)
* [ValueProvider](#value-provider)
* [FactoryProvider](#factory-provider)
* [ExistingProvider](#existing-provider) _(meta)_

### ClassProvider
tbd.

### ValueProvider
tbd.

### FactoryProvider
tbd.

### ExistingProvider
tbd.

# FAQs

### What kind of dependencies can be injected?

Please referr to the documentation of the different [providers](#providers) where you can see what's supported and what not.

### Is it also compatible with JavaScript?

In theory; yes, but practically; no ... it's currently built on top of the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) package. This means the main decorator part which makes this framework as flawless as it is, is only usable within TypeScript.
