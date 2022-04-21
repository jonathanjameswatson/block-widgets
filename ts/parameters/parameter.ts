export interface Parameter<T = any> {
  type: string
  name: string
  predicate: (input: T) => boolean
  serialise: (input: T) => string
  deserialise: (input: string) => T
  defaultValue: T
  componentName: string
  convertInput: (input: any) => T
  props: { [prop: string]: any }
  disabled: boolean
}

export const parameter = <T, U extends Parameter<T>>(
  name: string,
  type: string,
  predicate: (input: T) => boolean,
  serialise: (input: T) => string,
  deserialise: (input: string) => T,
  defaultValue: T,
  componentName: string,
  convertInput: (input: any) => T,
  props: { [prop: string]: any },
  extras: Omit<U, keyof Parameter>,
  disabled: boolean = false
) => {
  return {
    name,
    type,
    predicate,
    serialise,
    deserialise,
    defaultValue,
    componentName,
    convertInput,
    props,
    ...extras,
    disabled,
  } as U
}
