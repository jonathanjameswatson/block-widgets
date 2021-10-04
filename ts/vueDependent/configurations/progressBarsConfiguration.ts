import booleanParameter from '../parameters/booleanParameter'
import stringParameter from '../parameters/stringParameter'
import numberParameter from '../parameters/numberParameter'

import Configuration, { addParameter } from './configuration'

export default class MenuConfiguration extends Configuration {
  @addParameter(stringParameter('Title', 'Progress bars'))
  public title: string = 'Progress bars'

  @addParameter(stringParameter('Full symbol', '▮'))
  public fullSymbol: string = '▮'

  @addParameter(stringParameter('Empty symbol', '▯'))
  public emptySymbol: string = '▯'

  @addParameter(numberParameter('Number of symbols', 3, 50, 1))
  public numberOfSymbols: number = 10

  @addParameter(booleanParameter('Ascending periods', 'Off', 'On', true, '6ch'))
  public ascendingPeriods: boolean = true

  @addParameter(booleanParameter('Minute', 'Off', 'On', true, '6ch'))
  public minute: boolean = true

  @addParameter(booleanParameter('Hour', 'Off', 'On', true, '6ch'))
  public hour: boolean = true

  @addParameter(booleanParameter('Day', 'Off', 'On', true, '6ch'))
  public day: boolean = true

  @addParameter(booleanParameter('Week', 'Off', 'On', true, '6ch'))
  public week: boolean = true

  @addParameter(booleanParameter('Month', 'Off', 'On', true, '6ch'))
  public month: boolean = true

  @addParameter(booleanParameter('Year', 'Off', 'On', true, '6ch'))
  public year: boolean = true
}
