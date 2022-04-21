import { Parameter } from '../parameters/parameter'
import { unionParameter } from '../parameters/unionParameter'
import { booleanParameter } from '../parameters/booleanParameter'
import { stringParameter } from '../parameters/stringParameter'

const themes = ['System', 'Light', 'Dark']
const styles = ['Default', 'Serif', 'Mono']
const capitalisations = ['Normal', 'Lower case', 'Upper case', 'Title case']

export interface Configuration {
  configurationName: string
  theme: typeof themes[number]
  oldDarkStyle: boolean
  style: typeof styles[number]
  textSize: boolean
  padding: boolean
  textWrapping: boolean
  underline: boolean
  capitalisation: typeof capitalisations[number]
  css: string
}

export const configurationProperties: {
  [configurationName: string]: {
    factory: () => Configuration
    parameters: {
      [parameterKey in Exclude<
        keyof Configuration,
        'configurationName'
      >]: Parameter
    }
    toParameterObject: (configuration: Configuration) => Object
    setFromParameterObject: (
      configuration: Configuration,
      query: { [parameterKey: string]: string }
    ) => void
  }
} = {}

export const initialiseConfiguration = <T extends Configuration>(
  configurationName: string,
  parameters: {
    [parameterKey in Exclude<keyof T, 'configurationName'>]: Parameter
  }
) => {
  if (configurationProperties[configurationName] !== undefined) {
    return
  }

  configurationProperties[configurationName] = {
    factory() {
      const defaultConfiguration = {} as T
      Object.entries(parameters).forEach(([parameterKey, parameter]) => {
        defaultConfiguration[parameterKey as keyof T] = parameter.defaultValue
      })
      defaultConfiguration.configurationName = configurationName
      return defaultConfiguration
    },
    parameters,
    toParameterObject(configuration: Configuration) {
      const parameterObject: { [parameterKey: string]: string } = {}
      Object.entries(parameters).forEach(([parameterKey, parameter]) => {
        if (
          configuration[parameterKey as keyof Configuration] !==
          parameter.defaultValue
        ) {
          parameterObject[parameterKey] = parameter.serialise(
            configuration[parameterKey as keyof Configuration]
          )
        }
      })
      return parameterObject as Object
    },
    setFromParameterObject(
      configuration: Configuration,
      parameterObject: { [parameterKey: string]: string }
    ) {
      Object.entries(parameters).forEach(([parameterKey, parameter]) => {
        if (parameterObject[parameterKey] !== undefined) {
          const typedValue = parameter.deserialise(
            parameterObject[parameterKey]
          )
          if (parameter.predicate(typedValue as never)) {
            configuration[parameterKey as keyof Configuration] =
              typedValue as never
          }
        }
      })
    },
  }
}

export const configurationParameters = {
  theme: unionParameter('Theme', themes, '9ch'),
  oldDarkStyle: booleanParameter('Dark style', 'New', 'Old', false, '6ch'),
  style: unionParameter('Style', styles, '10ch'),
  textSize: booleanParameter('Text size', 'Normal', 'Small', false, '10ch'),
  padding: booleanParameter('Padding', 'Off', 'On', true, '6ch'),
  textWrapping: booleanParameter('Text wrapping', 'Off', 'On', true, '6ch'),
  underline: booleanParameter('Underlining', 'Off', 'On', true, '6ch'),
  capitalisation: unionParameter('Capitalisation', capitalisations, '15ch'),
  css: stringParameter('Custom CSS', '/* span { color: red; } */', ''),
}

initialiseConfiguration('configuration', configurationParameters)
