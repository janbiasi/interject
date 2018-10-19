# ValueProvider

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

#### Enable multiple values _(currently unsupported / default behaviour)_
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

