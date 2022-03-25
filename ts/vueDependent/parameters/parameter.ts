import type { Component } from 'vue'

export interface Parameter<T = any> {
  type: string
  propertyKey: string | symbol
  name: string
  predicate: (input: T) => boolean
  serialise: (input: T) => string
  deserialise: (input: string) => T
  component: Component
  convertInput: (input: any) => T
  props: { [prop: string]: any }
  disabled: boolean
}

export const parameter =
  <T, U extends Parameter<T>>(
    name: string,
    type: string,
    predicate: (input: T) => boolean,
    serialise: (input: T) => string,
    deserialise: (input: string) => T,
    component: Component,
    convertInput: (input: any) => T,
    props: { [prop: string]: any },
    extras: Omit<U, keyof Parameter>,
    disabled: boolean = false
  ) =>
  (propertyKey: string | symbol): U => {
    return {
      name,
      type,
      propertyKey,
      predicate,
      serialise,
      deserialise,
      component,
      convertInput,
      props,
      ...extras,
      disabled,
    } as U
  }
