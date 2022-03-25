import { Parameter, parameter } from './parameter'

import BlueSelect from '~/components/blue/BlueSelect.vue'

export interface BooleanParameter extends Parameter<boolean> {
  type: 'boolean'
  falseLabel: string
  trueLabel: string
  defaultBoolean: boolean
  minWidth: string
}

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
    (input) => input.toString(),
    (input) => input === 'true',
    BlueSelect,
    (value) => value as boolean,
    {
      options: [defaultBoolean, !defaultBoolean],
      optionNames: (defaultBoolean
        ? (x: string[]) => x
        : (x: string[]) => x.reverse())([trueLabel, falseLabel]),
      minWidth,
    },
    {
      falseLabel,
      trueLabel,
      defaultBoolean,
      minWidth,
    },
    disabled
  )
