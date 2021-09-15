import 'reflect-metadata'
import Configuration, { addParameter } from './configuration'
import { stringParameter, booleanParameter } from '~/ts/parameters'

export default class MenuConfiguration extends Configuration {
  @addParameter(stringParameter('Buttery bot URL', '/proxy'))
  public butteryBotUrl: string = ''

  @addParameter(booleanParameter('Emojis', 'Off', 'On', true, '6ch'))
  public emojis: boolean = true
}
