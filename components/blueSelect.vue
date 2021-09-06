<template>
  <div class="inline-block">
    <blue-button
      v-for="(option, i) in props.options"
      :key="i"
      class="mr-0"
      :rounding="getRounding(i, props.options.length)"
      :active="option === props.value"
      @click="() => updateValue(option)"
    >
      {{ optionNames[i] !== undefined ? props.optionNames[i] : option }}
    </blue-button>
  </div>
</template>

<script setup lang="ts">
interface Props<T> {
  value: T
  options: T[]
  optionNames?: string[]
}

const props = withDefaults(defineProps<Props<any>>(), {
  optionNames: () => [],
})

const emit =
  defineEmits<{
    (e: 'input', value: any): void
  }>()

const updateValue = (value: any) => {
  emit('input', value)
}

const getRounding = (i: number, length: number) => {
  if (i === 0) {
    return 'rounded-l'
  } else if (i === length - 1) {
    return 'rounded-r'
  } else {
    return ''
  }
}
</script>
