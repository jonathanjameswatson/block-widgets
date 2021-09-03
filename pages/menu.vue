<template>
  <menu-widget />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import setConfiguration from '~/ts/setConfiguration'
import MenuConfiguration from '~/ts/menuConfiguration'

export default defineComponent({
  setup() {
    setConfiguration(MenuConfiguration)
  },
})
</script>
