<template>
  <div>
    <i class="wi text-4xl" :class="[`wi-${item.icon}`]"></i>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
})
</script>
