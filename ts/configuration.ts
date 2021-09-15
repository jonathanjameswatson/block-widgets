import 'reflect-metadata'

import {
  Parameter,
  unionParameter,
  stringParameter,
  booleanParameter,
} from '~/ts/parameters'
import {
  collectMetadataArray,
  collectMetadataPropertyValue,
} from '~/ts/reflectionHelpers'

const parameterNamesSymbol = Symbol('parameter')
const parameterSymbol = Symbol('parameter')

export const getParameterNames = <T extends Configuration>(
  target: T
): (keyof T)[] => collectMetadataArray(parameterNamesSymbol, target)

export const getParameter = <T extends Configuration>(
  target: T,
  propertyKey: keyof T
): Parameter => {
  return collectMetadataPropertyValue(parameterSymbol, target, propertyKey)
}

export const addParameter = (
  parameterCreator: <T extends Object>(
    propertyKey: string | symbol
  ) => Parameter
) => {
  return <T extends Object>(target: T, propertyKey: keyof T) => {
    if (typeof propertyKey === 'number') {
      throw new TypeError('A number cannot be an editable parameter.')
    }

    const parameterNames = (Reflect.getOwnMetadata(
      parameterNamesSymbol,
      target
    ) || []) as (keyof T)[]

    if (!parameterNames.includes(propertyKey)) {
      parameterNames.push(propertyKey)
    }

    Reflect.defineMetadata(parameterNamesSymbol, parameterNames, target)
    Reflect.defineMetadata(
      parameterSymbol,
      parameterCreator(propertyKey),
      target,
      propertyKey
    )
  }
}

const themes = ['System', 'Light', 'Dark']
const styles = ['Default', 'Serif', 'Mono']
const capitalisations = ['Normal', 'Lower case', 'Upper case', 'Title case']

export default class Configuration {
  @addParameter(unionParameter('Theme', themes, '9ch'))
  public theme: typeof themes[number] = 'System'

  @addParameter(unionParameter('Style', styles, '10ch'))
  public style: typeof styles[number] = 'Default'

  @addParameter(booleanParameter('Text size', 'Normal', 'Small', false, '10ch'))
  public textSize: boolean = false

  @addParameter(booleanParameter('Padding', 'Off', 'On', true, '6ch'))
  public padding: boolean = true

  @addParameter(booleanParameter('Text wrapping', 'Off', 'On', true, '6ch'))
  public textWrapping: boolean = true

  @addParameter(unionParameter('Capitalisation', capitalisations, '15ch'))
  public capitalisation: typeof capitalisations[number] = 'Normal'

  @addParameter(stringParameter('Custom CSS', '/* p { color: red; } */'))
  public css: string = ''

  public toParameterObject() {
    // @ts-ignore
    const original = new this.constructor()
    return Object.fromEntries(
      getParameterNames<this>(this)
        .filter((key) => this[key] !== original[key])
        .map((key) => [key, this[key]])
    ) as { [key: string | symbol]: any }
  }

  public setFromParameterObject(query: Object) {
    const editableProperties = getParameterNames<this>(this) as (
      | string
      | symbol
    )[]
    Object.entries(query).forEach(([key, value]) => {
      const parameter = getParameter(this, key as keyof this)
      const typedValue = parameter.stringToType(value)
      if (
        editableProperties.includes(key) &&
        parameter.predicate(typedValue as never)
      ) {
        this[key as keyof this] = typedValue as any
      }
    })
  }
}
