import { booleanParameter } from '../parameters/booleanParameter'
import { stringParameter } from '../parameters/stringParameter'
import { numberParameter } from '../parameters/numberParameter'

import {
  initialiseConfiguration,
  configurationParameters,
  Configuration,
} from './configuration'

export interface ProgressBarsConfiguration extends Configuration {
  title: string
  fullSymbol: string
  emptySymbol: string
  numberOfSymbols: number
  ascendingPeriods: boolean
  minute: boolean
  hour: boolean
  day: boolean
  week: boolean
  month: boolean
  year: boolean
}

initialiseConfiguration<ProgressBarsConfiguration>(
  'progressBarsConfiguration',
  {
    title: stringParameter('Title', 'Progress bars', 'Progress bars'),
    fullSymbol: stringParameter('Full symbol', '▮', '▮'),
    emptySymbol: stringParameter('Empty symbol', '▯', '▯'),
    numberOfSymbols: numberParameter('Number of symbols', 3, 50, 1, 10),
    ascendingPeriods: booleanParameter(
      'Time period order',
      'Descending',
      'Ascending',
      true,
      '14ch'
    ),
    minute: booleanParameter('Minute', 'Off', 'On', true, '6ch'),
    hour: booleanParameter('Hour', 'Off', 'On', true, '6ch'),
    day: booleanParameter('Day', 'Off', 'On', true, '6ch'),
    week: booleanParameter('Week', 'Off', 'On', true, '6ch'),
    month: booleanParameter('Month', 'Off', 'On', true, '6ch'),
    year: booleanParameter('Year', 'Off', 'On', true, '6ch'),
    ...configurationParameters,
  }
)
