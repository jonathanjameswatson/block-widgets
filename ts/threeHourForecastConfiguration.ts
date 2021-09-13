import 'reflect-metadata'
import Configuration, {
  parameter,
  stringParameter,
  numberParameter,
} from './configuration'

export default class ThreeHourForecastConfiguration extends Configuration {
  @parameter(
    stringParameter(
      'Met Office client ID',
      '4hvrm3fb-nhjj-b1t2-6rg9-8lq48k4y4ofp',
      true
    )
  )
  public clientId: string = ''

  @parameter(
    stringParameter(
      'Met Office client secret',
      'lZ4HJNehFMJf9wRsyxw62TgdeNluiCVxslMlyvwKbSMNqtztXe',
      true
    )
  )
  public clientSecret: string = ''

  @parameter(numberParameter('Latitude', -85, 85, null, true))
  public latitude: number = 0

  @parameter(numberParameter('Longitude', -180, 180, null, true))
  public longitude: number = 0
}
