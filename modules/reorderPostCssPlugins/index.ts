import { defineNuxtModule } from '@nuxt/kit'

import type { Plugin } from 'postcss'

const order = (names: Plugin[]) => {
  const tailwindNesting = names.splice(
    names.findIndex((plugin) => plugin.postcssPlugin === 'tailwindcss/nesting'),
    1
  )[0]
  names.unshift(tailwindNesting)
}

export default defineNuxtModule({
  hooks: {
    'vite:extend'({ config }) {
      order(config.css.postcss.plugins)
    },
  },
})
