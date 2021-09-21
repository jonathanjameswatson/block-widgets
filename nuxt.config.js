export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,
  loading: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
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
        content: 'Customisable Notion widgets ',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/main.pcss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vue.js', '~/plugins/configuration.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    'nuxt-vite',
    ['@nuxt/typescript-build', { typeCheck: false }],
    '~/modules/generateWordToFoodEmojis',
    '~/modules/addWidgetRoutes',
    '@nuxtjs/composition-api/module',
    [
      'unplugin-auto-import/nuxt',
      {
        imports: ['@nuxtjs/composition-api'],
        dts: './auto-imports.generated.d.ts',
      },
    ],
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '~/modules/addProxies',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL:
      process.env.NETLIFY === 'true'
        ? 'https://widgets.jonathanjameswatson.com:443'
        : process.env.NETLIFY_DEV === 'true'
        ? 'http://localhost:8888'
        : 'http://localhost:3000',
    proxy: true,
  },

  // Proxies for @nuxtjs/proxy, set by addProxies module
  proxy: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        'postcss-simple-vars': {},
        'postcss-nested': {},
        cssnano: { preset: ['default', { calc: false }] },
        'postcss-calc': {},
      },
    },
  },

  // Color mode configuration
  colorMode: {
    classSuffix: '',
  },
}
