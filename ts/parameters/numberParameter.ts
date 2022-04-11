import { Parameter, parameter } from './parameter'

export interface NumberParameter extends Parameter<number> {
  type: 'number'
  minimum?: number
  maximum?: number
  step?: number
}

export const numberParameter = (
  name: string,
  minimum: number | undefined,
  maximum: number | undefined,
  step: number | undefined,
  defaultValue: number,
  disabled: boolean = false
) =>
  parameter<number, NumberParameter>(
    name,
    'number',
    (input) =>
      !(
        isNaN(input) ||
        (minimum !== undefined && input < minimum) ||
        (maximum !== undefined && input > maximum) ||
        (step !== undefined && (input / step) % 1 !== 0)
      ),
    (input) => input.toString(),
    (input) => Number(input),
    defaultValue,
    'BlueNumberInput',
    (input) => input as number,
    {
      minimum,
      maximum,
      step,
    },
    {
      ...(minimum === undefined ? {} : { minimum }),
      ...(maximum === undefined ? {} : { maximum }),
      ...(step === undefined ? {} : { step }),
    },
    disabled
  )
