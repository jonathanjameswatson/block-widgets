<template>
  <div class="block leading-notion min-w-0" :class="truncate">
    <slot />
  </div>
</template>

<script setup lang="ts">
const configuration = useConfiguration()

const truncate = computed(() =>
  configuration.value.textWrapping ? undefined : 'truncate-child'
)
</script>

<style scoped lang="postcss">
.truncate-child::deep(span) {
  @apply block truncate;
}
</style>
