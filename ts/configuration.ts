import 'reflect-metadata'

const editablePropertySymbol = Symbol('editableProperties')
const nameSymbol = Symbol('name')
const parameterSymbol = Symbol('parameter')

type UnionParameter = {
  type: 'union'
  options: string[]
  predicate: (input: string) => boolean
}

type StringParameter = {
  type: 'string'
  placeholder: string
  predicate: (input: string) => boolean
}

type BooleanParameter = {
  type: 'boolean'
  predicate: (input: boolean) => boolean
}

type ParameterType = UnionParameter | StringParameter | BooleanParameter

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
  return array
}

const collectMetadataPropertyValue = <T extends Configuration>(
  metadataKey: any,
  target: T,
  propertyKey: string | symbol
) => {
  let currentPrototype = Object.getPrototypeOf(target)
  while (currentPrototype !== Object.prototype) {
    const current = Reflect.getOwnMetadata(
      metadataKey,
      currentPrototype,
      propertyKey
    )
    if (current !== undefined) {
      return current
    }
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }
  return undefined
}

export const getEditableProperties = <T extends Configuration>(
  target: T
): (keyof T)[] =>
  collectMetadataArray(editablePropertySymbol, target) as (keyof T)[]

export const getPropertyMetadata = <T extends Configuration>(
  target: T,
  propertyKey: string
) => {
  const name = collectMetadataPropertyValue(
    nameSymbol,
    target,
    propertyKey
  ) as string
  const parameter = collectMetadataPropertyValue(
    parameterSymbol,
    target,
    propertyKey
  ) as ParameterType
  return {
    propertyKey,
    name,
    parameter,
  }
}

export const parameter = (name: string, parameter: ParameterType) => {
  return <T extends Configuration>(target: T, propertyKey: string) => {
    const properties = (Reflect.getOwnMetadata(
      editablePropertySymbol,
      target
    ) || []) as string[]

    if (!properties.includes(propertyKey)) {
      properties.push(propertyKey)
    }

    Reflect.defineMetadata(editablePropertySymbol, properties, target)
    Reflect.defineMetadata(nameSymbol, name, target, propertyKey)
    Reflect.defineMetadata(parameterSymbol, parameter, target, propertyKey)
  }
}

const themes = ['System', 'Light', 'Dark']
const styles = ['Default', 'Serif', 'Mono']
const textSizes = ['Normal', 'Small']
const capitalisations = ['Normal', 'Lower case', 'Upper case', 'Title case']

export const unionParameter = (options: string[]): UnionParameter => {
  return {
    type: 'union',
    options,
    predicate: (input: string) => options.includes(input),
  }
}

export const stringParameter = (placeholder: string): StringParameter => {
  return {
    type: 'string',
    placeholder,
    predicate: (input: string) => input !== '',
  }
}

export const booleanParameter = (): BooleanParameter => {
  return {
    type: 'boolean',
    predicate: (_input: boolean) => true,
  }
}

export default class Configuration {
  constructor(query: Object = {}) {
    this.fromParameterObject(query)
  }

  @parameter('Theme', unionParameter(themes))
  public theme: typeof themes[number] = 'System'

  @parameter('Style', unionParameter(styles))
  public style: typeof styles[number] = 'Default'

  @parameter('Text size', unionParameter(textSizes))
  public textSize: typeof textSizes[number] = 'Normal'

  @parameter('Capitalisation', unionParameter(capitalisations))
  public capitalisation: typeof capitalisations[number] = 'Normal'

  @parameter('Custom CSS', stringParameter('/* p { color: red; } */'))
  public css: string = ''

  toParameterObject() {
    // @ts-ignore
    const original = new this.constructor()
    return Object.fromEntries(
      getEditableProperties<this>(this)
        .filter((key) => this[key] !== original[key])
        .map((key) => [key, this[key]])
    )
  }

  fromParameterObject(query: Object) {
    const editableProperties = getEditableProperties<this>(this) as string[]
    Object.entries(query).forEach(([key, value]) => {
      if (
        editableProperties.includes(key) &&
        getPropertyMetadata(this, key).parameter.predicate(value as never)
      ) {
        // @ts-ignore
        this[key] = value
      }
    })
  }
}
