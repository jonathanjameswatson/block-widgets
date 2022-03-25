import { booleanParameter } from '../parameters/booleanParameter'
import { stringParameter } from '../parameters/stringParameter'

import { Configuration, addParameter } from './configuration'

export class MenuConfiguration extends Configuration {
  @addParameter(stringParameter('Buttery bot URL', '/proxy'))
  public butteryBotUrl: string = ''

  @addParameter(booleanParameter('Emojis', 'Off', 'On', true, '6ch'))
  public emojis: boolean = true
}
