<!-- prettier-ignore -->

<template>
  <div
    class="
      inline-block
      bg-blue-500
      hover:bg-blue-700
      text-white
      font-bold
      rounded
    "
  >
    <select
      class="
        inline-block
        font-bold
      bg-blue-500
      hover:bg-blue-700
        rounded
        appearance-none
        p-2
        pr-6
        -mr-6
        outline-none
        shadow-none
        z-20
      "
      :value="value"
      @input="updateValue($event.target.value)"
    >
      <option
        v-for="(option, i) in options"
        :key="i"
        :value="option"
        class="outline-none shadow-none"
      >
        {{ option }}
      </option></select
    ><!--
    --><div class="pointer-events-none inline-block h-4 pt-0.5">
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </div>
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
  },
  setup(_props, { emit }) {
    const updateValue = (value: string) => {
      emit('input', value)
    }

    return {
      updateValue,
    }
  },
})
</script>
