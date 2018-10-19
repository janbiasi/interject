# VersionProvider

Provides the Interject version.

```ts
import { CommonInjector, VersionProvider, VersionProviderToken } from '@interject/core';

const injector = CommonInjector.create({
    providers: [VersionProvider]
});

console.log(injector.get(VersionProviderToken)); // 'v0.1.0'
```
