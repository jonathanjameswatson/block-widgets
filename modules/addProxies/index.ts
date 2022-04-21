import { defineNuxtModule } from '@nuxt/kit'

import { readFile, writeFile } from 'fs-extra'

import { getProxies } from '../../ts/getProxies'

export default defineNuxtModule({
  hooks: {
    'vite:extend'({ config }) {
      const proxies = getProxies(process.env)
      config.server.proxy =
        config.server.proxy === undefined ? {} : config.server.proxy
      Object.entries(proxies).forEach(([proxy, url]) => {
        config.server.proxy[`/${proxy}`] = {
          target: url,
          changeOrigin: true,
          rewrite(path: string) {
            return path.replace(new RegExp(`^\/${proxy}`), '')
          },
        }
      })
    },
  },
})
