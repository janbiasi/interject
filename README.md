[![Build Status](https://travis-ci.org/janbiasi/interject.svg?branch=master)](https://travis-ci.org/janbiasi/interject)
[![Coverage Status](https://coveralls.io/repos/github/janbiasi/interject/badge.svg?branch=master)](https://coveralls.io/github/janbiasi/interject?branch=master)

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

A class provider is typically used for building services as singleton. The module afterwards will automatically take care of that the service will only be instanciated once. Therefor is a decorator to help you creating injectable services with the name `Injectable`. It can be used directly as a decorator for flawless integration into existing code bases.

```ts
import { Injectable } from '@interject/core';

@Injectable()
export class MyService {
    public get value() {
        return 10;
    }
}
```

Sometimes you also want to swap classes based on certain environment conditions, for example a logger; it might should output other information in dev mode than in production or even replace the whole log mechanism. Therefor you can also create class providers dynamically inside the code.

```ts
import { Injectable, InjectionToken } from '@interject/core';

// API definition
interface Logger {
    log(...args: any): void;
}

// Token for injection
export const LoggerToken = new InjectionToken<Logger>('logger');

export class DevLogger implements Logger {
    log(...args: any[]) { console.log.apply(console, args) }
}

export class ProdLogger implements Logger {
    log(...args: any[]) { /* do nothing */ }
}

// this will be our provider
export const Logger = {
    provide: LoggerToken,
    useClass:
        process.env.NODE_ENV === 'development'
            ? DevLogger
            : ProdLogger
}
```

### ValueProvider

As the name says, you can also provide simple values as injectables for example if you need a global configuration or version manager.

```ts
import { InjectionToken } from '@interject/core';

export type ConfigType = {
    env: 'production' | 'development',
    apiBaseURL: string
}

// token for dependency identification
export const ConfigToken = new InjectionToken<ConfigType>('config');

export const Config = {
    provide: ConfigToken,
    // value can be defined here
    useValue: {
        env: 'production',
        apiBaseURL: 'https://google.com/api/v1'
    }
}
```

### FactoryProvider
tbd.

### ExistingProvider _(meta)_
tbd.

# FAQs

### What kind of dependencies can be injected?

Please referr to the documentation of the different [providers](#providers) where you can see what's supported and what not.

### Is it also compatible with JavaScript?

In theory; yes, but practically; no ... it's currently built on top of the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) package. This means the main decorator part which makes this framework as flawless as it is, is only usable within TypeScript.
