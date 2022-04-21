<template>
  <div>
    <Body :class="oldDarkStyle" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const configuration = useConfiguration()
const oldDarkStyle = computed(() =>
  configuration.value.oldDarkStyle ? 'old-dark' : undefined
)
</script>
