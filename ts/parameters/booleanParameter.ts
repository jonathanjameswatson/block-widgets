import { Parameter, parameter } from './parameter'

export interface BooleanParameter extends Parameter<boolean> {
  type: 'boolean'
  falseLabel: string
  trueLabel: string
  minWidth: string
}

export const booleanParameter = (
  name: string,
  falseLabel: string,
  trueLabel: string,
  defaultValue: boolean,
  minWidth: string = '0px',
  disabled: boolean = false
) =>
  parameter<boolean, BooleanParameter>(
    name,
    'boolean',
    (_) => true,
    (input) => input.toString(),
    (input) => input === 'true',
    defaultValue,
    'BlueSelect',
    (value) => value as boolean,
    {
      options: [defaultValue, !defaultValue],
      optionNames: (defaultValue
        ? (x: string[]) => x
        : (x: string[]) => x.reverse())([trueLabel, falseLabel]),
      minWidth,
    },
    {
      falseLabel,
      trueLabel,
      minWidth,
    },
    disabled
  )
