<template>
  <input
    class="
      text-white
      placeholder-gray-200 placeholder-opacity-60
      py-2
      px-4
      font-bold
      mb-2
      mr-2
      focus:outline-none
    "
    :class="classes"
    v-bind="$attrs"
    @input="input"
  />
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from '@nuxtjs/composition-api'

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
    const { disabled, active, rounding } = toRefs(props)

    const input = (event: InputEvent) => {
      if (!disabled.value) {
        emit('input', event)
      }
    }

    const classes = computed(() => {
      const classes: string[] = []

      if (active.value) {
        classes.push('bg-blue-700')
      } else {
        classes.push('bg-blue-500')
      }

      if (disabled.value) {
        classes.push('opacity-50', 'cursor-not-allowed')
      } else if (active.value) {
        classes.push('hover:bg-blue-900')
      } else {
        classes.push('hover:bg-blue-700')
      }
      classes.push(rounding.value)
      return classes
    })

    return {
      input,
      classes,
    }
  },
})
</script>
