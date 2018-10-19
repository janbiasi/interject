# Metadata Reflection

Interject defines information needed by the framework in metadata format direct on the required classes.

### Available definition keys

* **custom:injectable** (defined on `@Injectable` classes)
* **custom:token** (defined on `@Injectable` classes)
* **custom:injector** (defined on `@Module` classes)
* **custom:bootstrap** (defined on `@Module` classes)

##### custom:injectable
tbd.

```ts
import 'reflect-metadata';
import { Injectable, Module } from '@interject/core';

@Injectable()
class X {}

Reflect.getMetadata('custom:injectable', X);
// { provide: X, useClass: X }
```

##### custom:token
tbd.

```ts
import 'reflect-metadata';
import { Injectable, Module } from '@interject/core';

@Injectable()
class X {}

Reflect.getMetadata('custom:token', X);
// X
```

##### custom:injector
tbd.

```ts
import 'reflect-metadata';
import { Injectable, Module } from '@interject/core';

@Module()
class App {}

Reflect.getMetadata('custom:injector', obj);
// Injector { VersionProvider }
```

##### custom:bootstrap
tbd.

```ts
import 'reflect-metadata';
import { Injectable, Module } from '@interject/core';

Reflect.getMetadata('custom:bootstrap', obj);
// () => [Injector.bootstrap] : providers[]
```
