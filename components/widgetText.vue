<template>
  <span>
    {{ capitalisedText }}
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  computed,
  toRefs,
  Ref,
} from '@nuxtjs/composition-api'

import Configuration from '~/ts/configuration'

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

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { text } = toRefs(props)
    const configuration = inject('configuration') as Ref<Configuration>
    const capitalisedText = computed(() =>
      capitalisers[configuration.value.capitalisation](text.value)
    )
    return {
      capitalisedText,
    }
  },
})
</script>
