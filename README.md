# jjw-widgets

## About

This project includes a few customisable widgets that I use in Notion. These widgets try to replicate Notion's style as much as possible.

## Widgets

-  Met Office three hour forecast
-  Buttery bot

## Features

- Theme customisation (system/light/dark)
- Style customisation (default/serif/mono)
- Text size customisation (normal/small)
- Optional padding
- Optional text wrapping
- Capitalisation customisation (normal/lower case/upper case/title case)
- Custom CSS

## Website

https://widgets.jonathanjameswatson.com/

## Deployment

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

# serve the dist/ directory for testing
$ yarn start
```

### Netlify

This project is set up for Netlify to make use of its proxies. However, it is not required.

### Environment variables

| Environment variable                   | Purpose                                                                                | Example                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `MET_OFFICE_THREE_HOUR_FORECAST_PROXY` | The path used to access the Met Office three hour forecast API. Do not set to disable. | `forecast`                                                                                           |
| `MET_OFFICE_THREE_HOUR_FORECAST_URL`   | The URL of the Met Office three hour forecast API.                                     | `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/three-hourly` |
| `BUTTERY_BOT_PROXY`                    | The path used to access the buttery bot. Do not set to disable.                        | `buttery`                                                                                            |
| `BUTTERY_BOT_URL`                      | The URL of the buttery bot.                                                            | `https://???.com`                                                                                    |

## License

[MIT license](https://choosealicense.com/licenses/mit/)
