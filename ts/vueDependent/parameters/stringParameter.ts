import { Parameter, parameter } from './parameter'

import BlueInput from '~/components/blue/BlueInput.vue'

export interface StringParameter extends Parameter<string> {
  type: 'string'
  placeholder: string
}

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
    (input) => input,
    BlueInput,
    (input: string | number) => input as string,
    {
      placeholder,
    },
    {
      placeholder,
    },
    disabled
  )
