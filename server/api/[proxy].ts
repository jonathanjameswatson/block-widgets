import { getProxy, fetchProxy } from '~/ts/proxy'

export default defineEventHandler((event) => {
  const { proxies: proxiesJson } = useRuntimeConfig()
  const { proxy: name } = event.context.params
  const proxy = getProxy(proxiesJson, name)

  return fetchProxy(proxy, undefined, event)
})
