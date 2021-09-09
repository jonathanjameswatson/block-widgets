<template>
  <button
    class="text-white py-2 px-4 font-bold mb-2 mr-2 leading-relaxed"
    :class="classes"
    @click="click"
  >
    <slot />
  </button>
</template>

<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  active?: boolean
  rounding?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  active: false,
  rounding: 'rounded',
})

const emit =
  defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()

const click = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
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
