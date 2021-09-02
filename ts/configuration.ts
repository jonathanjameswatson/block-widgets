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

type ParameterType = UnionParameter | StringParameter

export const getEditableProperties = <T>(target: Configuration) =>
  Reflect.getMetadata(editablePropertySymbol, target) as (keyof T)[]

export const getPropertyMetadata = (
  target: Configuration,
  propertyKey: string
) => {
  const name = Reflect.getMetadata(nameSymbol, target, propertyKey) as string
  const parameter = Reflect.getMetadata(
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
  return (target: Configuration, propertyKey: string) => {
    const properties: string[] =
      getEditableProperties<Configuration>(target) || []

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

const unionParameter = (options: string[]): UnionParameter => {
  return {
    type: 'union',
    options,
    predicate: (input: string) => options.includes(input),
  }
}

const stringParameter = (placeholder: string): StringParameter => {
  return {
    type: 'string',
    placeholder,
    predicate: (string: string) => string !== '',
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
        getPropertyMetadata(this, key).parameter.predicate(value)
      ) {
        // @ts-ignore
        this[key] = value
      }
    })
  }
}
