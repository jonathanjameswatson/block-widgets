<template>
  <blue-input
    v-bind="$attrs"
    type="number"
    :value="value"
    :disabled="disabled"
    :active="active"
    :rounding="rounding"
    :minimum="minimum"
    :maximum="maximum"
    :step="step"
    @input="updateValue"
  />
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
interface Props {
  value: number
  disabled?: boolean
  active?: boolean
  rounding?: string
  minimum?: number
  maximum?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  active: false,
  rounding: 'rounded',
  minimum: undefined,
  maximum: undefined,
  step: undefined,
})

const emit =
  defineEmits<{
    (e: 'input', payload: number): void
  }>()

const updateValue = (event: Event) => {
  const { value } = event.target as unknown as {
    value: string | number | undefined | null
  }

  let numberValue = Number(value)

  if (!props.disabled && value !== '' && !isNaN(numberValue)) {
    if (props.step !== undefined && (numberValue / props.step) % 1 === 0) {
      numberValue = Math.floor(numberValue / props.step) * props.step
    }

    if (props.minimum !== undefined && props.minimum > numberValue) {
      numberValue = props.minimum
    }

    if (props.maximum !== undefined && props.maximum < numberValue) {
      numberValue = props.maximum
    }

    emit('input', numberValue)
  }

  nextTick(() => {
    ;(event.target as unknown as HTMLInputElement).checkValidity()
  })
}
</script>

<style scoped lang="postcss">
.selection-class::selection {
  background: #f3f4f6;
  @apply text-blue-700;
}
</style>
