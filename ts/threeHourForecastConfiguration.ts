import 'reflect-metadata'
import Configuration, {
  parameter,
  stringParameter,
  numberParameter,
  booleanParameter,
  unionParameter,
} from './configuration'

const temperatureUnits = ['°C', '°F', 'K']
const temperatureTypes = ['Feels like', 'Minimum', 'Maximum', 'Average']

export default class ThreeHourForecastConfiguration extends Configuration {
  @parameter(stringParameter('Met Office API endpoint', '/proxy'))
  public endpoint: string = ''

  @parameter(
    stringParameter(
      'Met Office client ID',
      '4hvrm3fb-nhjj-b1t2-6rg9-8lq48k4y4ofp'
    )
  )
  public clientId: string = ''

  @parameter(
    stringParameter(
      'Met Office client secret',
      'lZ4HJNehFMJf9wRsyxw62TgdeNluiCVxslMlyvwKbSMNqtztXe'
    )
  )
  public clientSecret: string = ''

  @parameter(numberParameter('Latitude', -85, 85, null))
  public latitude: number = 52.2018

  @parameter(numberParameter('Longitude', -180, 180, null))
  public longitude: number = 0.1144

  @parameter(numberParameter('Number of items', 0, 50, 1))
  public items: number = 8

  @parameter(booleanParameter('Icons', 'Off', 'On', true, '6ch'))
  public icons: boolean = true

  @parameter(stringParameter('Time format', 'Do: Ha'))
  public timeFormat: string = 'Do: ha'

  @parameter(unionParameter('Unit of temperature', temperatureUnits, '6ch'))
  public temperatureUnit: typeof temperatureUnits[number] = '°C'

  @parameter(unionParameter('Type of temperature', temperatureTypes, '13ch'))
  public temperatureType: typeof temperatureTypes[number] = 'Feels like'
}
