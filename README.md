[![Build Status](https://travis-ci.org/janbiasi/interject.svg?branch=master)](https://travis-ci.org/janbiasi/interject)
[![Coverage Status](https://codecov.io/gh/janbiasi/interject/branch/master/graph/badge.svg)](https://codecov.io/gh/janbiasi/interject)

## Idea and use-case
This framework is inspired by Angular's dependency injection concept but it's far more lightweight and smaller without all the features and not exactly the same regarding the usage and concept.

## Core principals
tbd.

### Definining injectables

Each injectable is defined with a key. The key is not only a string, it's rather a token. Inside the interject framework they're called `InjectionToken`. The key can also be any type of constructable class (not object!). Dependencies defined by a token are registered inside an Injector which then can be provided by a method called `get`. The dependency will automatically be instanciated/called/exposed by the injector and provided to your module.

```ts
import { Injectable, InjectionToken } from '@interject/core';

@Injectable()
class InjectableService {}

export const injectableValue = {
    provide: new InjectionToken<string>('injectable value token'),
    useValue: 'Hello there!'
}
```

### Defining modules

Each module defines an application entrypoint. The module than can be bootstrapped via the `bootstrap` method exposed by the core. This will resolve all providers and subproviders for each injectable and return the module with all providers needed.

```ts
import { Module, bootstrap } from '@interject/core';

@Module({
    providers: [
        { provide: new InjectionToken<string>('test'), useValue: 'test' }
    ]
})
class MyModule {
    constructor(private test: string) {}
}

const inst = bootstrap(MyModule);
console.log(inst.test); // 'test'
```

## Providers

* [ClassProvider](#class-provider)
* [ValueProvider](#value-provider)
* [FactoryProvider](#factory-provider)
* [ExistingProvider](#existing-provider) _(meta)_

### ClassProvider

A class provider is typically used for building services as singleton. The module afterwards will automatically take care of that the service will only be instanciated once. Therefor is a decorator to help you creating injectable services with the name `Injectable`. It can be used directly as a decorator for flawless integration into existing code bases.

```ts
import { Module, Injectable } from '@interject/core';

@Injectable()
class MyService {
    public get value() {
        return 10;
    }
}

@Module({
    providers: [MyService]
})
class MyModule {
    constructor(private service: MyService) {}
}
```

Sometimes you also want to swap classes based on certain environment conditions, for example a logger; it might should output other information in dev mode than in production or even replace the whole log mechanism. Therefor you can also create class providers dynamically inside the code.

```ts
import { Injectable, InjectionToken } from '@interject/core';

interface Logger {
    log(...args: any): void;
}

const LoggerToken = new InjectionToken<Logger>('logger');

class DevLogger implements Logger {
    log(...args: any[]) { console.log.apply(console, args) }
}

class ProdLogger implements Logger {
    log(...args: any[]) { /* do nothing */ }
}

const LoggerProvider = {
    provide: LoggerToken,
    useClass:
        process.env.NODE_ENV === 'development'
            ? DevLogger
            : ProdLogger
}
```

##### Requiring other injectables

It is also possible to inject other injectables into the injectable class by defining a `requires` property.

```ts
import { Injectable, InjectionToken } from '@interject/core';

@Injectable({
    requires: [
        { useValue: 10, provide: someToken }
    ]
})
class MyService {
    constructor(private value: number) {}
}

@Module({
    providers: [MyService]
})
class MyModule {}
```

### ValueProvider

As the name says, you can also provide simple values as injectables for example if you need a global configuration or version manager.

```ts
import { InjectionToken } from '@interject/core';

type ConfigType = { env: 'production' | 'development' };

const ConfigToken = new InjectionToken<ConfigType>('config');

const ConfigProvider = {
    provide: ConfigToken,
    // value can be defined here
    useValue: {
        env: 'production'
    }
};
```

##### Enable multiple values _(currently unsupported / default behaviour)_
If you intend to get multiple values from a value provider e.g. for like a language config,
you'll need to set this flag to get all values from a token and not just the latest.

> **Important**: this is not supported atm. The example shows how the feature will be expected to work in the future! It is not recommended to use more than one provider with the same token.

```ts
import { InjectionToken, Module } from '@interject/core';

type Language = 'de' | 'en' | 'it' | 'fr';

const LanguageToken = new InjectionToken<Language[]>('languages');

@Module({
    providers: [
        { provide: LanguageToken, useValue: 'de', multi: true },
        { provide: LanguageToken, useValue: 'en', multi: true }
    ]
})
class LanguageModule {
    constructor(private languages: Language[]) {
        console.log(languages); // ['de', 'en']
    }
}
```

If you wont add a multi flag to the provider itself it would just output `en` because it was the latest value provided!.

### FactoryProvider

Factories can also be provided as injectable, which will just be executed once.
The result will be cached inside the corresponding module and will be returned on each request.

```ts
import { InjectionToken } from '@interject/core';

const FactoryToken = new InjectionToken<ConfigType>('my factory');

const FactoryProvider = {
    provide: FactoryToken,
    // value can be defined here
    useFactory: () => 'some return value'
};
```


##### Requiring other injectables

It is also possible to inject other injectables into the injectable class by defining a `requires` property.

```ts
import { Injectable, InjectionToken } from '@interject/core';

export const FactoryProvider = {
    provide: new InjectionToken<string[]>('somefactory'),
    useFactory: (someValue: string) => ['hello', 'there', someValue],
    requires: [
        { useValue: 'you!', provide: someToken }
    ]
};

// will inject ['hello', 'there', 'you!']
```

### ExistingProvider

Use another token for resolving the values of the current token. This can be helpful for overwriting injectables depending on conditions.

```ts
import { Injectable } from '@interject/core';

@Injectable()
class Greeting {
    salutation = 'Hello';
}
 
@Injectable()
class FormalGreeting extends Greeting {
    salutation = 'Greetings';
}

@Module({
    providers: [
        FormalGreeting,
        { provide: Greeting, useExisting: FormalGreeting }
    ]
})
class MyModule {}
```

# FAQs

### What kind of dependencies can be injected?

Please referr to the documentation of the different [providers](#providers) where you can see what's supported and what not.

### Is it also compatible with JavaScript?

In theory; yes ... it's currently built on top of the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) package. This means the main decorator part which makes this framework as flawless as it is, is only usable within TypeScript. But you can also call the decorators via JavaScript - unhandy but works! However, we recommend you using TypeScript for this framework.
