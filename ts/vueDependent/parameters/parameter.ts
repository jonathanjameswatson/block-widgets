export interface Parameter<T = any> {
  type: string
  propertyKey: string | symbol
  name: string
  predicate: (input: T) => boolean
  stringToType: (input: string) => T
  component: Vue.Component
  convertInput: (input: any) => T
  props: { [prop: string]: any }
  disabled: boolean
}

export const parameter =
  <T, U extends Parameter<T>>(
    name: string,
    type: string,
    predicate: (input: T) => boolean,
    stringToType: (input: string) => T,
    component: Vue.Component,
    convertInput: (input: any) => T,
    props: { [prop: string]: any },
    extras: Omit<
      U,
      | 'name'
      | 'type'
      | 'propertyKey'
      | 'predicate'
      | 'stringToType'
      | 'component'
      | 'convertInput'
      | 'props'
      | 'disabled'
    >,
    disabled: boolean = false
  ) =>
  (propertyKey: string | symbol): U => {
    return {
      name,
      type,
      propertyKey,
      predicate,
      stringToType,
      component,
      convertInput,
      props,
      ...extras,
      disabled,
    } as U
  }
