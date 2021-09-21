import { Parameter, parameter } from './parameter'

import Input from '~/components/blue/input.vue'

export interface StringParameter extends Parameter<string> {
  type: 'string'
  placeholder: string
}

export default (name: string, placeholder: string, disabled: boolean = false) =>
  parameter<string, StringParameter>(
    name,
    'string',
    (input) => input !== '',
    (input) => input,
    Input,
    (input: Event) => (input.target as unknown as { value: string }).value,
    {
      placeholder,
    },
    {
      placeholder,
    },
    disabled
  )
