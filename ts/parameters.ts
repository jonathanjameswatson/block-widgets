export interface ParameterBase<T> {
  type: string
  propertyKey: string | symbol
  name: string
  disabled: boolean
  predicate: (input: T) => boolean
  stringToType: (input: string) => T
}

export interface UnionParameter extends ParameterBase<string> {
  type: 'union'
  options: string[]
  minWidth: string
}

export interface StringParameter extends ParameterBase<string> {
  type: 'string'
  placeholder: string
}

export interface BooleanParameter extends ParameterBase<boolean> {
  type: 'boolean'
  falseLabel: string
  trueLabel: string
  defaultBoolean: boolean
  minWidth: string
}

export interface NumberParameter extends ParameterBase<number> {
  type: 'number'
  minimum?: number
  maximum?: number
  step?: number
}

export type Parameter =
  | UnionParameter
  | StringParameter
  | BooleanParameter
  | NumberParameter

const parameter =
  <T, U extends ParameterBase<T>>(
    name: string,
    type: string,
    predicate: (input: T) => boolean,
    stringToType: (input: string) => T,
    extras: Omit<
      U,
      | 'type'
      | 'propertyKey'
      | 'disabled'
      | 'name'
      | 'predicate'
      | 'stringToType'
    >,
    disabled: boolean = false
  ) =>
  (propertyKey: string | symbol): U => {
    return {
      type,
      propertyKey,
      name,
      disabled,
      predicate,
      stringToType,
      ...extras,
    } as U
  }

export const unionParameter = (
  name: string,
  options: string[],
  minWidth: string = '0px',
  disabled: boolean = false
) =>
  parameter<string, UnionParameter>(
    name,
    'union',
    (input) => options.includes(input),
    (input) => input,
    {
      options,
      minWidth,
    },
    disabled
  )

export const stringParameter = (
  name: string,
  placeholder: string,
  disabled: boolean = false
) =>
  parameter<string, StringParameter>(
    name,
    'string',
    (input) => input !== '',
    (input) => input,
    {
      placeholder,
    },
    disabled
  )

export const booleanParameter = (
  name: string,
  falseLabel: string,
  trueLabel: string,
  defaultBoolean: boolean,
  minWidth: string = '0px',
  disabled: boolean = false
) =>
  parameter<boolean, BooleanParameter>(
    name,
    'boolean',
    (_) => true,
    (input) => input === 'true',
    {
      falseLabel,
      trueLabel,
      defaultBoolean,
      minWidth,
    },
    disabled
  )

export const numberParameter = (
  name: string,
  minimum: number | null = null,
  maximum: number | null = null,
  step: number | null = null,
  disabled: boolean = false
) =>
  parameter<number, NumberParameter>(
    name,
    'number',
    (input) =>
      !(
        isNaN(input) ||
        (minimum !== null && input < minimum) ||
        (maximum !== null && input > maximum) ||
        (step !== null && (input / step) % 1 !== 0)
      ),
    (input) => Number(input),
    {
      ...(minimum === null ? {} : { minimum }),
      ...(maximum === null ? {} : { maximum }),
      ...(step === null ? {} : { step }),
    },
    disabled
  )
