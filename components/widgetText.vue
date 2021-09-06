<template>
  <span>
    {{ capitalisedText }}
  </span>
</template>

<script lang="ts">
import { getConfiguration } from '~/ts/configurationControllers'

const wordRegexp = /[^ ]+/g
const capitalisers: { [option: string]: (x: string) => string } = {
  Normal: (x: string) => x,
  'Lower case': (x: string) => x.toLowerCase(),
  'Upper case': (x: string) => x.toUpperCase(),
  'Title case': (x: string) =>
    x.replaceAll(
      wordRegexp,
      (y: string) => y.charAt(0).toUpperCase() + y.slice(1)
    ),
}
</script>

<script setup lang="ts">
const configuration = getConfiguration()

const props =
  defineProps<{
    text: string
  }>()

const capitalisedText = computed(() =>
  capitalisers[configuration.value.capitalisation](props.text)
)
</script>
