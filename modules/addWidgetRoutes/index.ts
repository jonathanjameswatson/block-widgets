import { defineNuxtModule } from '@nuxt/kit'

import { WIDGET_URLS } from '../../ts/widgets'

export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.options.generate.routes = Object.assign([], WIDGET_URLS)
  },
})
