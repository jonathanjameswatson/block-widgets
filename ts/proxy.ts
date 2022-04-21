import { $fetch } from 'ohmyfetch'
import type { CompatibilityEvent } from 'h3'

export interface Proxy {
  destination: string
  headers?: {
    [key: string]: string
  }
}

export type Proxies = { [key: string]: Proxy }

export const getProxy = (proxiesJson: string, name: string) => {
  if (typeof proxiesJson !== 'string') {
    proxiesJson = JSON.stringify(proxiesJson) // i shouldn't have to do this
  }

  if (proxiesJson === '' || proxiesJson === '{}') {
    throw new Error('Proxies not enabled')
  }

  const proxies = JSON.parse(proxiesJson) as Proxies

  if (!Object.keys(proxies).includes(name)) {
    throw new Error('Proxy not found')
  }

  return proxies[name]
}

export const fetchProxy = (
  proxy: Proxy,
  endpoint: string | undefined,
  event: CompatibilityEvent
) => {
  return $fetch(
    endpoint === undefined
      ? proxy.destination
      : `${proxy.destination}/${endpoint}`,
    {
      headers: proxy.headers,
      params: useQuery(event),
      method: useMethod(event),
    }
  )
}
