/* eslint-disable no-use-before-define */
import 'reflect-metadata'

const parameterNamesSymbol = Symbol('parameter')
const parameterSymbol = Symbol('parameter')

export interface ParameterBase<T extends Configuration, U> {
  type: string
  propertyKey: keyof T
  name: string
  disabled: boolean
  predicate: (input: U) => boolean
  stringToType: (input: string) => U
}

export interface UnionParameter<T extends Configuration>
  extends ParameterBase<T, string> {
  type: 'union'
  options: string[]
  minWidth: string
}

export interface StringParameter<T extends Configuration>
  extends ParameterBase<T, string> {
  type: 'string'
  placeholder: string
}

export interface BooleanParameter<T extends Configuration>
  extends ParameterBase<T, boolean> {
  type: 'boolean'
  falseLabel: string
  trueLabel: string
  defaultBoolean: boolean
  minWidth: string
}

export interface NumberParameter<T extends Configuration>
  extends ParameterBase<T, number> {
  type: 'number'
  minimum?: number
  maximum?: number
  step?: number
}

export type Parameter<T extends Configuration> =
  | UnionParameter<T>
  | StringParameter<T>
  | BooleanParameter<T>
  | NumberParameter<T>

const collectMetadataArray = <T extends Configuration>(
  metadataKey: any,
  target: T
) => {
  const array = []
  let currentPrototype = Object.getPrototypeOf(target)
  while (currentPrototype !== Object.prototype) {
    const currentArray =
      Reflect.getOwnMetadata(metadataKey, currentPrototype) || []
    array.push(...currentArray)
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }
  return array as T[keyof T][]
}

const collectMetadataPropertyValue = <T extends Configuration>(
  metadataKey: any,
  target: T,
  propertyKey: keyof T
) => {
  if (typeof propertyKey === 'number') {
    return undefined
  }

  let currentPrototype = Object.getPrototypeOf(target)
  while (currentPrototype !== Object.prototype) {
    const current = Reflect.getOwnMetadata(
      metadataKey,
      currentPrototype,
      propertyKey
    )
    if (current !== undefined) {
      return current as T[keyof T]
    }
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }
  return undefined
}

export const getParameterNames = <T extends Configuration>(
  target: T
): (keyof T)[] =>
  collectMetadataArray(parameterNamesSymbol, target) as unknown as (keyof T)[]

export const getParameter = <T extends Configuration>(
  target: T,
  propertyKey: keyof T
) => {
  return collectMetadataPropertyValue(
    parameterSymbol,
    target,
    propertyKey
  ) as unknown as Parameter<T>
}

export const parameter = (
  parameterCreator: <T extends Configuration>(
    propertyKey: keyof T
  ) => Parameter<T>
) => {
  return <T extends Configuration>(target: T, propertyKey: keyof T) => {
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

export const unionParameter = (
  name: string,
  options: string[],
  minWidth: string = '0px',
  disabled: boolean = false
) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'union',
      propertyKey,
      disabled,
      name,
      options,
      minWidth,
      predicate: (input: string) => options.includes(input),
      stringToType: (input: string) => input,
    } as UnionParameter<T>
  }
}

export const stringParameter = (
  name: string,
  placeholder: string,
  disabled: boolean = false
) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'string',
      propertyKey,
      disabled,
      name,
      placeholder,
      predicate: (input: string) => input !== '',
      stringToType: (input: string) => input,
    } as StringParameter<T>
  }
}

export const booleanParameter = (
  name: string,
  falseLabel: string,
  trueLabel: string,
  defaultBoolean: boolean,
  minWidth: string = '0px',
  disabled: boolean = false
) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'boolean',
      propertyKey,
      disabled,
      name,
      falseLabel,
      trueLabel,
      defaultBoolean,
      minWidth,
      predicate: (_input: boolean) => true,
      stringToType: (input: string) => input === 'true',
    } as BooleanParameter<T>
  }
}

export const numberParameter = (
  name: string,
  minimum: number | null = null,
  maximum: number | null = null,
  step: number | null = null,
  disabled: boolean = false
) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'number',
      propertyKey,
      disabled,
      name,
      ...(minimum === null ? {} : { minimum }),
      ...(maximum === null ? {} : { maximum }),
      ...(step === null ? {} : { step }),
      predicate(input: number) {
        if (isNaN(input)) {
          return false
        }
        if (minimum !== null && input < minimum) {
          return false
        }
        if (maximum !== null && input > maximum) {
          return false
        }
        if (step !== null && (input / step) % 1 !== 0) {
          return false
        }
        return true
      },
      stringToType: (input: string) => Number(input),
    } as NumberParameter<T>
  }
}

export default class Configuration {
  @parameter(unionParameter('Theme', themes, '9ch'))
  public theme: typeof themes[number] = 'System'

  @parameter(unionParameter('Style', styles, '10ch'))
  public style: typeof styles[number] = 'Default'

  @parameter(booleanParameter('Text size', 'Normal', 'Small', false, '10ch'))
  public textSize: boolean = false

  @parameter(unionParameter('Capitalisation', capitalisations, '15ch'))
  public capitalisation: typeof capitalisations[number] = 'Normal'

  @parameter(stringParameter('Custom CSS', '/* p { color: red; } */'))
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
