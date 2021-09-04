<template>
  <div>
    <p class="text-blue-700 font-bold mr-2 mb-2">{{ label }}</p>
    <p class="mb-4">
      <slot />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
  },
})
</script>
