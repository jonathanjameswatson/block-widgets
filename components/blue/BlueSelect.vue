<template>
  <div class="grid gap-x-2 gap-y-0 w-full" :style="style">
    <BlueButton
      v-for="(option, i) in props.options"
      :key="i"
      class="mr-0"
      :active="option === props.modelValue"
      @click="() => updateValue(option)"
    >
      {{ optionNames[i] !== undefined ? props.optionNames[i] : option }}
    </BlueButton>
  </div>
</template>

<script setup lang="ts">
interface Props<T> {
  modelValue: T
  options: readonly T[]
  optionNames?: string[]
  minWidth?: string
}

const props = withDefaults(defineProps<Props<any>>(), {
  optionNames: () => [],
  minWidth: '0px',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const updateValue = (value: any) => {
  emit('update:modelValue', value)
}

const style = computed(
  () =>
    `grid-template-columns: repeat(auto-fit, minmax(${props.minWidth}, 1fr))`
)
</script>

<style scoped>
.custom-grid {
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
}
</style>
