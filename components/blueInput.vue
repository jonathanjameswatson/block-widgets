<template>
  <input
    class="text-white py-2 px-4 font-bold mb-2 mr-2 focus:outline-none"
    :class="classes"
    v-bind="attrs"
    @input="input"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    rounding: {
      type: String,
      required: false,
      default: 'rounded',
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const input = (event: InputEvent) => {
      if (!props.disabled) {
        emit('input', event)
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

    return {
      input,
      classes,
    }
  },
})
</script>
