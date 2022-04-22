import { getProxy, fetchProxy } from '~/ts/proxy'

export default defineEventHandler((event) => {
  console.log(`EVENT TIME: ${event} and ${useRuntimeConfig()}`)
  const { proxies: proxiesJson } = useRuntimeConfig()
  const { proxy: name } = event.context.params
  const proxy = getProxy(proxiesJson, name)

  const originalUrl = event.req.originalUrl ?? ''
  const endpointIndex = originalUrl.indexOf(`${name}/`)
  const endpoint =
    endpointIndex === -1
      ? ''
      : originalUrl.slice(endpointIndex + name.length + 1)

  return fetchProxy(proxy, endpoint, event)
})
