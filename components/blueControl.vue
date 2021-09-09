<template>
  <div>
    <p class="text-blue-700 font-bold mb-2">{{ props.label }}</p>
    <p class="mb-4">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
const props =
  defineProps<{
    label: string
  }>()
</script>
