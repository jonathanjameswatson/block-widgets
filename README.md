# BlockWidgets

> Simple widgets to mimic Notion's text blocks

![Example widgets](examples.png)

## Widgets

-  Met Office three hour forecast
-  Buttery bot

## Customisable features

- Theme customisation (system/light/dark)
- Style customisation (default/serif/mono)
- Text size customisation (normal/small)
- Optional padding
- Optional text wrapping
- Capitalisation customisation (normal/lower case/upper case/title case)
- CSS customisation

## Website

https://widgets.jonathanjameswatson.com/

## Development

### Setup

```bash
# clone repository and enter it
$ git clone https://github.com/jonathanjameswatson/jjw-widgets.git
$ cd jjw-widgets

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# generate project
$ yarn generate

# serve the dist/ directory for testing (without proxies)
$ yarn start
```

### Proxies

Proxies are defined in [getProxies.ts](./ts/getProxies.ts) and are automatically used by the development server and Netlify. If you are hosting this project on another provider, you may need to add these manually.

### How to create a new widget

1. If you want your widget to be customisable beyond the default configuration, create a new class that extends `Configuration` (found in [configuration.ts](./ts/vueDependent/configurations/configuration.ts)). Your new class must have a constructor that takes no arguments.
2. Create a new component for your widget. You should base this component on existing components in [widgets](./components/widgets). Use `useConfiguration<T>()` from [useConfiguration.ts](./composables/useConfiguration.ts) to import the configuration you need, setting `T` to the configuration class from the previous step (or omit `<T>` if you didn't create one).
3. Add your desired URL for the widget to the `WIDGET_URLS` array in [widgetUrls.ts](./ts/widgetUrls.ts). This array must not have any duplicate values.
4. Add an entry to the `widgets` object in [widgets.ts](./ts/vueDependent/widgets.ts) with its key being the widget URL from the previous step. Import the widget component from step two and the configuration from step one if you made one. The value of the entry should be an object with `name` as the widget's display name, `component` as the widget component and `configuration` as the widget's configuration class from step one (or `Configuration` if you didn't create one).

### How to create a new type of parameter

1. Consider the type of the value that this parameter will store. Let this be `T`.
2. Create or find a component to control the parameter. This component must have a `value` prop that can take values of type `T` and a `disabled` prop that takes a `boolean`. This component must also emit an `input` event with any value.
3. Create a new file exporting an interface that extends `Parameter<T>` from [parameter.ts](./ts/vueDependent/parameters/parameter.ts). Set `type` to be a unique string not used by any other parameters (found in [parameters](./ts/vueDependent/parameters)). Add any custom properties relevant to your new parameter not found in `Parameter<T>`.
4. Add a function to this file that returns a function that creates an object that implements this new interface. This function should be the default export of the file. The arguments of this function should be a display name (`name: string`), arguments that will be used to set the parameter's custom properties from step 3 and an argument that determines whether or not the parameter is disabled (`disabled: boolean`). This function should return the output of the `parameter<T, U extends Parameter<T>>(...)` function from [parameter.ts](./ts/vueDependent/parameters/parameter.ts). `U` should be the interface from step three. Call `parameter` with `name`, `type` (from step three), `predicate` (a function returns true if its argument is a valid value of the parameter), `stringToType` (a function that converts a string argument to type `T`), `component` (the component from step two), `convertInput` (a function that converts an argument given by `component`'s `input` event to type `T`), `props` (an object with any additional props that should be set on `component`), `extras` (an object with the parameter's custom properties from step 3) and `disabled`.

### How to create a new proxy

1. Assign a string of lowercase letters to environment variable `[INSERT NAME HERE]_PROXY`
2. Assign the desired URL to environment variable `[INSERT NAME HERE]_URL`
3. Add a new entry to the `proxies` object in [getProxies.ts](./ts/getProxies.ts) with key `[INSERT_NAME_HERE]_PROXY` and value `"[INSERT NAME HERE]_URL"`
4. Add the new environment variables to the below table

### Environment variables

| Environment variable                   | Purpose                                                                                | Example                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `MET_OFFICE_THREE_HOUR_FORECAST_PROXY` | The path used to access the Met Office three hour forecast API. Do not set to disable. | `forecast`                                                                                           |
| `MET_OFFICE_THREE_HOUR_FORECAST_URL`   | The URL of the Met Office three hour forecast API.                                     | `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/three-hourly` |
| `BUTTERY_BOT_PROXY`                    | The path used to access the buttery bot. Do not set to disable.                        | `buttery`                                                                                            |
| `BUTTERY_BOT_URL`                      | The URL of the buttery bot.                                                            | `https://???.com`                                                                                    |

### License

[MIT license](https://choosealicense.com/licenses/mit/)
