<template>
  <div class="block leading-notion min-w-0" :class="truncate">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useConfiguration from '~/composables/useConfiguration'

const configuration = useConfiguration()

const truncate = computed(() =>
  configuration.value.textWrapping ? null : 'truncate-child'
)
</script>

<style lang="postcss">
.truncate-child span {
  display: block;
  @apply truncate;
}
</style>
