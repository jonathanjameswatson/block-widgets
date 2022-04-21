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
  proxy: string
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
    proxy: stringParameter('Met Office API endpoint proxy', '/proxy', ''),
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
