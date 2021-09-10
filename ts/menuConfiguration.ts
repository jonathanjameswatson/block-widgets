import 'reflect-metadata'
import Configuration, {
  parameter,
  stringParameter,
  booleanParameter,
} from './configuration'

export default class MenuConfiguration extends Configuration {
  @parameter(stringParameter('Buttery bot URL', '/proxy'))
  public butteryBotUrl: string = ''

  @parameter(booleanParameter('Emojis', 'Off', 'On', true, '6ch'))
  public emojis: boolean = true
}
