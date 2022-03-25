import { Parameter, parameter } from './parameter'

import BlueSelect from '~/components/blue/BlueSelect.vue'

export interface UnionParameter extends Parameter<string> {
  type: 'union'
  options: string[]
  minWidth: string
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
    (input) => input,
    BlueSelect,
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
