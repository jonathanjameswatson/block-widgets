import { defineNuxtModule } from '@nuxt/kit'
import { snakeCase } from 'scule'

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}

const getCloudflareEnvironmentVariables = <T extends { [key: string]: any }>(
  config: T
): {
  [key in keyof T]: any
} => {
  return Object.fromEntries(
    entries(config).map(([key, value]) => {
      if (key === 'public') {
        return [key, getCloudflareEnvironmentVariables(value)]
      }
      const variableName = `NUXT_${snakeCase(key.toString()).toUpperCase()}`
      return [
        key,
        process.env[variableName] ??
          // @ts-expect-error
          (global[variableName] as string | undefined) ??
          value,
      ]
    })
  )
}

export default defineNuxtModule({
  async setup(_options, nuxt) {
    if (process.env.NITRO_PRESET === 'cloudflare') {
      nuxt.options.runtimeConfig = getCloudflareEnvironmentVariables(
        nuxt.options.runtimeConfig
      )
    }
  },
})
