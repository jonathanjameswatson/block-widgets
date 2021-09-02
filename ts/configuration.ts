import 'reflect-metadata'

const editablePropertySymbol = Symbol('editableProperties')
const nameSymbol = Symbol('name')
const parameterSymbol = Symbol('parameter')

type UnionParameter = {
  type: 'union'
  options: string[]
}

type StringParameter = {
  type: 'string'
}

type ParameterType = UnionParameter | StringParameter

export const getEditableProperties = (target: Configuration) =>
  Reflect.getMetadata(editablePropertySymbol, target) as string[]

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
  return (target: any, propertyKey: string) => {
    const properties: string[] = getEditableProperties(target) || []

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
  }
}

const stringParameter = (): StringParameter => {
  return {
    type: 'string',
  }
}

export default class Configuration {
  @parameter('Theme', unionParameter(themes))
  public theme: typeof themes[number] = 'System'

  @parameter('Style', unionParameter(styles))
  public style: typeof styles[number] = 'Default'

  @parameter('Text size', unionParameter(textSizes))
  public textSize: typeof textSizes[number] = 'Normal'

  @parameter('Capitalisation', unionParameter(capitalisations))
  public capitalisation: typeof capitalisations[number] = 'Normal'

  @parameter('Custom CSS', stringParameter())
  public css: string = ''
}
