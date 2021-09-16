<template>
  <span :class="classes">
    {{ capitalisedText }}
  </span>
</template>

<script lang="ts">
import useConfiguration from '~/composables/useConfiguration'

const wordRegExp = /[^ ]+/g
const capitalisers: { [option: string]: (x: string) => string } = {
  Normal: (x: string) => x,
  'Lower case': (x: string) => x.toLowerCase(),
  'Upper case': (x: string) => x.toUpperCase(),
  'Title case': (x: string) =>
    x.replaceAll(
      wordRegExp,
      (y: string) => y.charAt(0).toUpperCase() + y.slice(1)
    ),
}
</script>

<script setup lang="ts">
const configuration = useConfiguration()

const props = withDefaults(
  defineProps<{
    text: string
    underline?: boolean
  }>(),
  {
    underline: false,
  }
)

const capitalisedText = computed(() =>
  capitalisers[configuration.value.capitalisation](props.text)
)

const classes = computed(() =>
  props.underline
    ? 'border-b border-notion-border dark:border-notion-border-dark'
    : null
)
</script>
