
# ExistingProvider

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