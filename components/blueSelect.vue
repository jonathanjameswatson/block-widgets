<template>
  <div class="inline-block">
    <blue-button
      v-for="(option, i) in props.options"
      :key="i"
      class="mr-2"
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
</script>
