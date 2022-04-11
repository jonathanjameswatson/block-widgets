import { booleanParameter } from '../parameters/booleanParameter'
import { stringParameter } from '../parameters/stringParameter'

import {
  initialiseConfiguration,
  configurationParameters,
  Configuration,
} from './configuration'

export interface MenuConfiguration extends Configuration {
  butteryBotUrl: string
  emojis: boolean
}

initialiseConfiguration<MenuConfiguration>('menuConfiguration', {
  butteryBotUrl: stringParameter('Buttery bot URL', '/proxy', ''),
  emojis: booleanParameter('Emojis', 'Off', 'On', true, '6ch'),
  ...configurationParameters,
})
