<template>
  <div class="block leading-notion-inner min-w-0" :class="truncate">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { getConfiguration } from '~/ts/configurationControllers'

const configuration = getConfiguration()

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
