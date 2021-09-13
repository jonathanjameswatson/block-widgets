export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'jjw-widgets',
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
  css: ['~/assets/css/main.pcss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vue.js', '~/plugins/configuration.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    'nuxt-vite',
    ['@nuxt/typescript-build', { typeCheck: false }],
    '~/modules/generateWordToFoodEmojis',
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
        : 'http://localhost:8888',
    proxy: true,
  },

  proxy: {
    [`/${process.env.BUTTERY_BOT_PROXY}`]: {
      target: process.env.BUTTERY_BOT_URL,
      pathRewrite: {
        [`^/${process.env.BUTTERY_BOT_PROXY}/`]: '',
      },
    },
  },

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
