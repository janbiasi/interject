## ClassProvider

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

#### Requiring other injectables

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
