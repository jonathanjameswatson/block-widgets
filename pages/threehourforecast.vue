<template>
  <three-hour-forecast-widget />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import setConfiguration from '~/ts/setConfiguration'
import Configuration from '~/ts/configuration'

export default defineComponent({
  setup() {
    setConfiguration(Configuration)
  },
})
</script>
