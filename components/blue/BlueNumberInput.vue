<template>
  <BlueInput
    type="number"
    :model-value="modelValue"
    :disabled="disabled"
    :active="active"
    :rounding="rounding"
    :minimum="minimum"
    :maximum="maximum"
    :step="step"
    @update:model-value="updateValue"
    validate
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
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
})

const emit = defineEmits<{
  (e: 'update:modelValue', payload: number): void
}>()

const updateValue = (payload: string | number) => {
  let numberValue = Number(payload)

  if (!props.disabled && payload !== '' && !isNaN(numberValue)) {
    if (props.step !== undefined && (numberValue / props.step) % 1 === 0) {
      numberValue = Math.floor(numberValue / props.step) * props.step
    }

    if (props.minimum !== undefined && props.minimum > numberValue) {
      numberValue = props.minimum
    }

    if (props.maximum !== undefined && props.maximum < numberValue) {
      numberValue = props.maximum
    }

    emit('update:modelValue', numberValue)
  }
}
</script>

<style scoped lang="postcss">
.selection-class::selection {
  background: #f3f4f6;
  @apply text-blue-700;
}
</style>
