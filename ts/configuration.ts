/* eslint-disable no-use-before-define */
import 'reflect-metadata'

const parameterNamesSymbol = Symbol('parameter')
const parameterSymbol = Symbol('parameter')

export interface ParameterBase<T extends Configuration, U> {
  type: string
  propertyKey: keyof T
  name: string
  predicate: (input: U) => boolean
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

export type Parameter<T extends Configuration> =
  | UnionParameter<T>
  | StringParameter<T>
  | BooleanParameter<T>

const collectMetadataArray = <T extends Configuration>(
  metadataKey: any,
  target: T
) => {
  const array = []
  let currentPrototype = Object.getPrototypeOf(target)
  while (currentPrototype !== Object.prototype) {
    const currentArray =
      Reflect.getOwnMetadata(metadataKey, currentPrototype) || []
    array.unshift(...currentArray)
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
  minWidth: string = '0px'
) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'union',
      propertyKey,
      name,
      options,
      minWidth,
      predicate: (input: string) => options.includes(input),
    } as UnionParameter<T>
  }
}

export const stringParameter = (name: string, placeholder: string) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'string',
      propertyKey,
      name,
      placeholder,
      predicate: (input: string) => input !== '',
    } as StringParameter<T>
  }
}

export const booleanParameter = (
  name: string,
  falseLabel: string,
  trueLabel: string,
  defaultBoolean: boolean,
  minWidth: string = '0px'
) => {
  return <T extends Configuration>(propertyKey: keyof T) => {
    return {
      type: 'boolean',
      propertyKey,
      name,
      falseLabel,
      trueLabel,
      defaultBoolean,
      minWidth,
      predicate: (_input: boolean) => true,
    } as BooleanParameter<T>
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
      if (
        editableProperties.includes(key) &&
        getParameter(this, key as keyof this).predicate(value as never)
      ) {
        this[key as keyof this] = value
      }
    })
  }
}
