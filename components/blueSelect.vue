<template>
  <div class="inline-block">
    <blue-button
      v-for="(option, i) in options"
      :key="i"
      class="mr-0"
      :rounding="getRounding(i, options.length)"
      :active="option === value"
      @click="() => updateValue(option)"
    >
      {{ optionNames[i] !== undefined ? optionNames[i] : option }}
    </blue-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => string[],
      required: true,
    },
    optionNames: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
  },
  setup(_props, { emit }) {
    const updateValue = (value: string) => {
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

    return {
      updateValue,
      getRounding,
    }
  },
})
</script>
