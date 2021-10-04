<template>
  <div class="block leading-notion min-w-0 block-child" :class="truncate">
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

<style scoped lang="postcss">
.block-child::v-deep span {
  @apply block;
}

.truncate-child::v-deep span {
  @apply truncate;
}
</style>
