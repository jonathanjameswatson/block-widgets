import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  // Target
  target: 'static',
  ssr: false, // possibly remove later
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

  // Native ESM transpilation
  /*
  build: {
    transpile: [
      'dayjs',
      'dayjs/plugin/advancedFormat',
      'dayjs/plugin/utc',
      'dayjs/plugin/duration',
      'dayjs/plugin/isLeapYear',
    ],
  },

  alias: {
    dayjs: 'dayjs/dayjs.min.js',
    'dayjs/plugin/advancedFormat': 'dayjs/plugin/advancedFormat.js',
    'dayjs/plugin/utc': 'dayjs/plugin/utc.js',
    'dayjs/plugin/duration': 'dayjs/plugin/duration.js',
    'dayjs/plugin/isLeapYear': 'dayjs/plugin/isLeapYear.js',
  },
  */
})
