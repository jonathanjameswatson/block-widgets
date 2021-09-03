import 'reflect-metadata'
import Configuration, { parameter, booleanParameter } from './configuration'

export default class MenuConfiguration extends Configuration {
  @parameter('Emojis', booleanParameter())
  public emojis: boolean = false
}
