import { Parameter, parameter } from './parameter'

import Select from '~/components/blue/select.vue'

export interface UnionParameter extends Parameter<string> {
  type: 'union'
  options: string[]
  minWidth: string
}

export default (
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
    Select,
    (input) => input as string,
    {
      options,
      minWidth,
    },
    {
      options,
      minWidth,
    },
    disabled
  )
