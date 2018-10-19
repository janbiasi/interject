# FactoryProvider

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

### Requiring other injectables

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