<template>
  <div>
    <i class="wi text-4xl" :class="[`wi-${item.icon}`]"></i>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>
