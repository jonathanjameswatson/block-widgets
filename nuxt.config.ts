import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  // Target
  loading: {},

  // Global page headers
  meta: {
    title: 'BlockWidgets',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Customisable Notion widgets',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ],
  },

  // Global CSS
  css: ['@/assets/main.pcss'],

  // Modules for dev and build
  buildModules: [
    '~/modules/generateWordToFoodEmojis',
    '~/modules/addWidgetRoutes',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '~/modules/addProxies',
  ],

  // Axios module configuration (no longer used)
  /*
  axios: {
    baseURL:
      process.env.NETLIFY === 'true'
        ? 'https://widgets.jonathanjameswatson.com:443'
        : process.env.NETLIFY_DEV === 'true'
        ? 'http://localhost:8888'
        : 'http://localhost:3000',
  },
  */

  // Color mode configuration
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  // Nuxt generate configuration
  generate: {
    // @ts-ignore-next-line
    fallback: true,
  },

  // Typescript configuration
  typescript: {
    strict: true,
  },

  alias: {
    dayjs: 'dayjs/esm',
  },

  components: {
    global: true,
    dirs: ['~/components'],
  },
})
