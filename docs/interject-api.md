
# Interject API
You can also use the Injector as standalone version of the process instead of working with modules and TypeScript annotations. Therefor is a list below with all different parts of the library.

* [InjectionToken](#injectiontoken)
* [CommonInjector](#commoninjector)
    * [Injector](#injector)
* [Runtime](#runtime)
    * [Injector scope](#injector-scope)
    * [Metadata Reflection](#metadata-reflection)

## InjectionToken
Each injectable is defined with a key. The key is not only a string, it's rather a token. Inside the interject framework they're called `InjectionToken`. The key can also be any type of constructable class (not object!). Dependencies defined by a token are registered inside an Injector which then can be provided by a method called `get`. The dependency will automatically be instanciated/called/exposed without doing anything.

```ts
import { CommonInjector, InjectionToken } from '@interject/core';

class MyService {
    serialize(input: any): string {
        return JSON.stringify(input);
    }
}

const myFactory = () => 100;

const myFactoryToken = new InjectionToken<() => number>('some id here');
const myValueToken = new InjectionToken<string[]>('another id here');
const myServiceToken = new InjectionToken<MyService>('another id here');

const injector = CommonInjector.create({
    providers: [
        { provide: myFactoryToken, useFactory: myFactory },
        { provide: myValueToken, useValue: ['hello', 'world']},
        { provide: myServiceToken, useClass: MyService }
    ]
});

injector.get(myFactroyToken); // 100
injector.get(myValueToken); // ['hello', 'world']
injector.get(myServiceToken); // instanceof MyService { serialize(arg) { JSON.stringify(arg) } }
```

## CommonInjector
The CommonInjector is an abstract class which defines the main API of an injector. It is later implemented by the `Injector` class. You can create your injectors by a static method `.create()` and it will return you the correct injector instance with your providers.

> **Why do we need to use CommonInjector.create instead of new Injector?**: Well, this is for enabling more flexibility regarding the injector implementation. We could also swap the Injector implementation on the fly without breaking the API or your implementations. 

### Injector

This is the main implementation of the `CommonInjector` which implements all needed methods. It is NOT recommended to use this injector directly as it will destroy parent inheritance etc.

## Runtime
tbd.

### Injector Scope
tbd.
