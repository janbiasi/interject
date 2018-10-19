[![Build Status](https://travis-ci.org/janbiasi/interject.svg?branch=master)](https://travis-ci.org/janbiasi/interject)
[![Coverage Status](https://codecov.io/gh/janbiasi/interject/branch/master/graph/badge.svg)](https://codecov.io/gh/janbiasi/interject)

## Idea and use-case
This framework is inspired by Angular's dependency injection concept but it's far more lightweight and smaller without all the features and not exactly the same regarding the usage and concept.

### Core principals
In most frontend application you'll have multiple dependencies, and sometimes you also have kinda like "circular" or "multi-depth" dependencies which can't be resolved or conflicts inside your application build.
Sometimes you also just want a simple possibility to manage singletons, factories and values you need in different parts of the application without caring about how to distribute or allocate them. The `Interject` library will help you managing your dependencies with ease!

The following examples are written with TypeScript and decorators, if you plan to just use the most 'barebone' version make sure you checkout the [Interject API](docs/interject-api.md) for using the core as it is.

### Definining injectables

Each injectable is defined with a key. The key is not only a string, it's rather a token. Inside the interject framework they're called `InjectionToken`. The key can also be any type of constructable class (not object!). Dependencies defined by a token are registered inside an Injector which then can be provided by a method called `get`. The dependency will automatically be instanciated/called/exposed by the injector and provided to your module.

> TypeScript
```ts
import { Injectable, InjectionToken } from '@interject/core';

@Injectable()
class InjectableService {}

export const injectableValue = {
    provide: new InjectionToken<string>('injectable value token'),
    useValue: 'Hello there!'
}
```

> JavaScript
```js
const { Injectable, InjectionToken } = require('@interject/core');

class InjectableService {
    someMethod(): { a: 10 } {
        return { a: 10 };
    };
}

exports.InjectableService = {
    provide: InjectableService,
    useClass: InjectableService
};

exports.injectableValue = {
    provide: new InjectionToken<string>('injectable value token'),
    useValue: 'Hello there!'
};
```

### Defining modules

Each module defines an application entrypoint. The module than can be bootstrapped via the `bootstrap` method exposed by the core. This will resolve all providers and subproviders for each injectable and return the module with all providers needed. In the background, modules simply manage `Injectors` inside which manage you dependencies and inject it into the constructor of the class - which you don't have to use if you don't want to _(see: JavaScript)_!

> TypeScript
```ts
import { Module, bootstrap } from '@interject/core';

@Module({
    providers: [
        InjectableService, // taken from above
        { provide: new InjectionToken<string>('test'), useValue: 'test' }
    ]
})
class MyModule {
    constructor(private test: string) {}
}

const inst = bootstrap(MyModule);
console.log(inst.test); // 'test'
```

> JavaScript
```ts
const { CommonInjector, InjectionToken } = require('@interject/core');
const InjectableService = require('./InjectableService');

const testToken = new InjectionToken<string>('test')

const injector = CommonInjector.create(
    providers: [
        InjectableService, // taken from above
        { provide: testToken, useValue: 'test' }
    ]
});

console.log(injector.get(testToken)); // 'test'
console.log(injector.get(InjectableService).someMethod); // { a: 10 }
```

# Providers

There are a few provider-types you should be aware of. Each providers is built for a certain use-case. You'll find a detailed description of each below.

* [ClassProvider](docs/providers/class-provider.md)
* [ValueProvider](docs/providers/value-provider.md)
* [FactoryProvider](docs/providers/factory-provider.md)
* [ExistingProvider](docs/providers/existing-provider.md) _(meta)_
* [Built-in providers to use](docs/platform/)

If you're interested in building plugins for the Interject framework, you might checkout the `Metadata Reflection` API as interject heavily uses it for saving injection information on classes/objects. Please referr to the [Metadata Documentation](docs/metadata-reflection.md) for further reading.

# FAQs

### What kind of dependencies can be injected?

Please referr to the documentation of the different [providers](#providers) where you can see what's supported and what not.

### Is it also compatible with JavaScript?

In theory; yes ... it's currently built on top of the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) package. This means the main decorator part which makes this framework as flawless as it is, is only usable within TypeScript. But you can also call the decorators via JavaScript - unhandy but works! However, we recommend you using TypeScript for this framework. We recommend you using the straight `CommonInjector` and `InjectionToken` API within pure JavaScript application.