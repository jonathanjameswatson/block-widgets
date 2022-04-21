import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  // Loading bar
  loading: {},

  // Global page headers
  app: {
    head: {
      title: 'BlockWidgets',
      htmlAttrs: {
        lang: 'en',
      },
      viewport: 'width=device-width, initial-scale=1',
      meta: [
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
  },

  // Global CSS
  css: ['@/assets/main.pcss'],

  // Modules for dev and build
  buildModules: [
    '~/modules/getCloudflareWorkerVariables',
    '~/modules/generateWordToFoodEmojis',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  // Runtime config
  runtimeConfig: {
    proxies: '{}',
    public: {
      hostUrl:
        process.env.NODE_ENV === 'production'
          ? 'https://widgets.jonathanjameswatson.com'
          : 'http://localhost:3000',
    },
  },

  // Color mode configuration
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  // Typescript configuration
  typescript: {
    strict: true,
  },

  // css-tree fix
  build: {
    transpile: ['css-tree'],
  },

  // DayJs fix
  alias: {
    dayjs: 'dayjs/esm',
  },

  // Dynamic component import support
  components: {
    global: true,
    dirs: ['~/components'],
  },
})
