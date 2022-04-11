import { unionParameter } from '../parameters/unionParameter'
import { booleanParameter } from '../parameters/booleanParameter'
import { stringParameter } from '../parameters/stringParameter'
import { numberParameter } from '../parameters/numberParameter'

import {
  initialiseConfiguration,
  configurationParameters,
  Configuration,
} from './configuration'

const temperatureUnits = ['°C', '°F', 'K']
const temperatureTypes = ['Feels like', 'Minimum', 'Maximum', 'Average']

export interface ThreeHourForecastConfiguration extends Configuration {
  endpoint: string
  clientId: string
  clientSecret: string
  latitude: number
  longitude: number
  items: number
  icons: boolean
  timeFormat: string
  temperatureUnit: typeof temperatureUnits[number]
  temperatureType: typeof temperatureTypes[number]
}

initialiseConfiguration<ThreeHourForecastConfiguration>(
  'threeHourForecastConfiguration',
  {
    endpoint: stringParameter('Met Office API endpoint', '/proxy', ''),
    clientId: stringParameter(
      'Met Office client ID',
      '4hvrm3fb-nhjj-b1t2-6rg9-8lq48k4y4ofp',
      ''
    ),
    clientSecret: stringParameter(
      'Met Office client secret',
      'lZ4HJNehFMJf9wRsyxw62TgdeNluiCVxslMlyvwKbSMNqtztXe',
      ''
    ),
    latitude: numberParameter('Latitude', -85, 85, undefined, 52.2018),
    longitude: numberParameter('Longitude', -180, 180, undefined, 0.1144),
    items: numberParameter('Number of items', 0, 50, 1, 8),
    icons: booleanParameter('Icons', 'Off', 'On', true, '6ch'),
    timeFormat: stringParameter('Time format', 'Do: Ha', 'Do: Ha'),
    temperatureUnit: unionParameter(
      'Unit of temperature',
      temperatureUnits,
      '6ch'
    ),
    temperatureType: unionParameter(
      'Type of temperature',
      temperatureTypes,
      '13ch'
    ),
    ...configurationParameters,
  }
)
