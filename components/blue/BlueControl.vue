<template>
  <p class="text-blue-700 font-bold mb-3 text-lg">
    {{ props.label }}
  </p>
  <div class="mb-4">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>
