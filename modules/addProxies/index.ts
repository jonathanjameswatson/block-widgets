import { Module } from '@nuxt/types'
import fse from 'fs-extra'
import toml, { JsonMap } from '@iarna/toml'

import getProxies from '../../ts/getProxies'

interface NetlifyRedirectBase {
  from: string
  to: string
  status?: number
  force?: boolean
}

type NetlifyRedirect = JsonMap & RedirectBase

interface NetlifyProxy extends NetlifyRedirect {
  status: 200
  force: true
}

interface NetlifyConfigBase {
  redirects?: Redirect[]
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
    createProxy(`/${proxy}`, url),
    createProxy(`/${proxy}/*`, `${url}/:splat`),
  ]
}

const module: Module<{}> = async function (_moduleOptions) {
  const proxies = getProxies(process.env)

  // Netlify

  if (
    process.env.NETLIFY === 'true' &&
    process.env.npm_lifecycle_event === 'generate'
  ) {
    const configString = await fse.readFile('./netlify.toml', 'utf8')
    const config = (await toml.parse.async(configString)) as NetlifyConfig

    config.redirects =
      config.redirects === undefined
        ? ([] as NetlifyRedirect[])
        : config.redirects.filter((redirect) => !isNetlifyProxy(redirect))

    const newNetlifyProxies = Object.entries(proxies).flatMap(([proxy, url]) =>
      generateNetlifyProxies(proxy, url)
    )
    config.redirects.push(...newNetlifyProxies)

    const newConfigString = toml.stringify(config)
    await fse.writeFile('./netlify.toml', newConfigString)
  }

  // @nuxtjs/proxy

  this.options.proxy =
    this.options.proxy === undefined ? {} : this.options.proxy
  Object.entries(proxies).forEach(([proxy, url]) => {
    this.options.proxy[`/${proxy}`] = {
      target: url,
      pathRewrite: {
        [`^/${proxy}`]: '',
      },
    }
  })
}

export default module
