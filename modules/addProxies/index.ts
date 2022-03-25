import { defineNuxtModule } from '@nuxt/kit'

import { readFile, writeFile } from 'fs-extra'
import {
  JsonMap,
  parse as tomlParse,
  stringify as tomlStringify,
} from '@iarna/toml'

import { getProxies } from '../../ts/getProxies'

interface NetlifyRedirectBase {
  from: string
  to: string
  status?: number
  force?: boolean
}

type NetlifyRedirect = JsonMap & NetlifyRedirectBase

interface NetlifyProxy extends NetlifyRedirect {
  status: 200
  force: true
}

interface NetlifyConfigBase {
  redirects?: NetlifyRedirect[]
}

type NetlifyConfig = JsonMap & NetlifyConfigBase

const isNetlifyProxy = (redirect: NetlifyRedirect): redirect is NetlifyProxy =>
  redirect.status === 200 && redirect.force === true

const createNetlifyProxy = (from: string, to: string): NetlifyProxy => {
  return {
    from,
    to,
    status: 200,
    force: true,
  }
}

const generateNetlifyProxies = (
  proxy: string,
  url: string
): [NetlifyRedirect, NetlifyRedirect] => {
  return [
    createNetlifyProxy(`/${proxy}`, url),
    createNetlifyProxy(`/${proxy}/*`, `${url}/:splat`),
  ]
}

export default defineNuxtModule({
  async setup(_options, _nuxt) {
    const proxies = getProxies(process.env)

    // Netlify

    if (
      process.env.NETLIFY === 'true' &&
      process.env.npm_lifecycle_event === 'generate'
    ) {
      const configString = await readFile('./netlify.toml', 'utf8')
      const config = (await tomlParse.async(configString)) as NetlifyConfig

      config.redirects =
        config.redirects === undefined
          ? ([] as NetlifyRedirect[])
          : config.redirects.filter((redirect) => !isNetlifyProxy(redirect))

      const newNetlifyProxies = Object.entries(proxies).flatMap(
        ([proxy, url]) => generateNetlifyProxies(proxy, url)
      )
      config.redirects.push(...newNetlifyProxies)

      const newConfigString = tomlStringify(config)
      await writeFile('./netlify.toml', newConfigString)
    }
  },
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
