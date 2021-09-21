import {
  defineNuxtPlugin,
  onGlobalSetup,
  ref,
  provide,
} from '@nuxtjs/composition-api'

import Configuration from '~/ts/vueDependent/configurations/configuration'

export default defineNuxtPlugin((_) => {
  onGlobalSetup(() => {
    const configuration = ref(new Configuration())

    provide('configuration', configuration)
  })
})
