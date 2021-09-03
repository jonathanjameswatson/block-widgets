<template>
  <nuxt class="mx-auto p-4" />
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  useContext,
  Ref,
  onMounted,
} from '@nuxtjs/composition-api'
import Configuration from '~/ts/configuration'

export default defineComponent({
  setup() {
    onMounted(() => {
      const configuration = inject('configuration') as Ref<Configuration>
      const { $colorMode } = useContext()
      $colorMode.preference = configuration.value.theme.toLowerCase()
    })
  },
})
</script>

<style lang="postcss">
body {
  @apply text-notion-text bg-notion-bg dark:text-notion-text-dark dark:bg-notion-bg-dark font-serif;
}
</style>
