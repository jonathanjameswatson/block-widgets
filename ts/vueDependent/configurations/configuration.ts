import 'reflect-metadata'

import { Parameter } from '../parameters/parameter'
import { unionParameter } from '../parameters/unionParameter'
import { booleanParameter } from '../parameters/booleanParameter'
import { stringParameter } from '../parameters/stringParameter'

import { narrowingIncludes } from '~/ts/helpers/typeHelpers'
import {
  collectMetadataArray,
  collectMetadataPropertyValue,
} from '~/ts/helpers/reflectionHelpers'

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
  parameterCreator: (propertyKey: string | symbol) => Parameter
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

export class Configuration {
  @addParameter(unionParameter('Theme', themes, '9ch'))
  public theme: typeof themes[number] = 'System'

  @addParameter(booleanParameter('Dark style', 'New', 'Old', false, '6ch'))
  public oldDarkStyle: boolean = false

  @addParameter(unionParameter('Style', styles, '10ch'))
  public style: typeof styles[number] = 'Default'

  @addParameter(booleanParameter('Text size', 'Normal', 'Small', false, '10ch'))
  public textSize: boolean = false

  @addParameter(booleanParameter('Padding', 'Off', 'On', true, '6ch'))
  public padding: boolean = true

  @addParameter(booleanParameter('Text wrapping', 'Off', 'On', true, '6ch'))
  public textWrapping: boolean = true

  @addParameter(booleanParameter('Underlining', 'Off', 'On', true, '6ch'))
  public underline: boolean = true

  @addParameter(unionParameter('Capitalisation', capitalisations, '15ch'))
  public capitalisation: typeof capitalisations[number] = 'Normal'

  @addParameter(stringParameter('Custom CSS', '/* span { color: red; } */'))
  public css: string = ''

  public toParameterObject() {
    let original: this
    try {
      original = new this.constructor()
    } catch {
      throw new TypeError(
        'All configuration objects must have a constructor with no arguments.'
      )
    }

    const editableProperties = getParameterNames<this>(this)

    return getParameterNames<this>(this).reduce((result, key) => {
      if (
        this[key] !== original[key] &&
        typeof key === 'string' &&
        narrowingIncludes<keyof this>(editableProperties, key)
      ) {
        const parameter = getParameter(this, key)
        const serialisedValue = parameter.serialise(this[key])
        result[key] = serialisedValue
      }
      return result
    }, {} as { [key: string]: string })
  }

  public setFromParameterObject(query: Object) {
    const editableProperties = getParameterNames<this>(this)
    Object.entries(query).forEach(([key, value]) => {
      if (narrowingIncludes<keyof this>(editableProperties, key)) {
        const parameter = getParameter(this, key)
        const typedValue = parameter.deserialise(value)
        if (parameter.predicate(typedValue as never)) {
          this[key] = typedValue as any
        }
      }
    })
  }

  ['constructor']: new () => this
}
