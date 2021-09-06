import 'reflect-metadata'
import Configuration, { parameter, booleanParameter } from './configuration'

export default class MenuConfiguration extends Configuration {
  @parameter(booleanParameter('Emojis', 'Off', 'On', true))
  public emojis: boolean = true
}
