import { Parameter, parameter } from './parameter'

import NumberInput from '~/components/blue/input.vue'

export interface NumberParameter extends Parameter<number> {
  type: 'number'
  minimum?: number
  maximum?: number
  step?: number
}

export default (
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
    NumberInput,
    (input) => input as number,
    {
      minimum,
      maximum,
      step,
    },
    {
      ...(minimum === null ? {} : { minimum }),
      ...(maximum === null ? {} : { maximum }),
      ...(step === null ? {} : { step }),
    },
    disabled
  )
