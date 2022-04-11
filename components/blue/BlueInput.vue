<template>
  <input
    class="text-white placeholder-gray-200 placeholder-opacity-60 w-full py-2 px-4 font-bold mb-2 mr-2 leading-relaxed focus:outline-none appearance-textfield selection-class"
    :value="modelValue"
    :class="classes"
    :disabled="disabled"
    @input="updateValue"
    ref="input"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  disabled?: boolean
  active?: boolean
  rounding?: string
  validate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  active: false,
  rounding: 'rounded',
  validate: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const input = ref<HTMLInputElement | undefined>()

const updateValue = (event: Event) => {
  if (!props.disabled) {
    emit('update:modelValue', (event.target as any).value as string | number)

    if (props.validate) {
      nextTick(() => {
        if (input.value !== undefined) {
          input.value.checkValidity()
        }
      })
    }
  }
}

const classes = computed(() => {
  const classes: string[] = []

  if (props.active) {
    classes.push('bg-blue-700')
  } else {
    classes.push('bg-blue-500')
  }

  if (props.disabled) {
    classes.push('opacity-50', 'cursor-not-allowed')
  } else if (props.active) {
    classes.push('hover:bg-blue-900')
  } else {
    classes.push('hover:bg-blue-700')
  }

  classes.push(props.rounding)

  return classes
})
</script>

<style scoped lang="postcss">
.selection-class::selection {
  background: #f3f4f6;
  @apply text-blue-700;
}

.appearance-textfield {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
