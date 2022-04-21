import { Parameter, parameter } from './parameter'

export interface StringParameter extends Parameter<string> {
  type: 'string'
  placeholder: string
}

export const stringParameter = (
  name: string,
  placeholder: string,
  defaultValue: string,
  disabled: boolean = false
) =>
  parameter<string, StringParameter>(
    name,
    'string',
    (input) => input !== '',
    (input) => input,
    (input) => input,
    defaultValue,
    'BlueInput',
    (input: string | number) => input as string,
    {
      placeholder,
    },
    {
      placeholder,
    },
    disabled
  )
