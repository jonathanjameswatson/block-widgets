import { defineNuxtModule } from '@nuxt/kit'
import { snakeCase } from 'scule'

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}

const withSetupEnvironmentVariables = <T extends { [key: string]: any }>(
  prefix: string,
  config: T
): {
  [key in keyof T]: any
} => {
  return Object.fromEntries(
    entries(config).map(([key, value]) => {
      if (key === 'public') {
        return [key, withSetupEnvironmentVariables('NUXT_PUBLIC', value)]
      }
      const variableName = `${prefix}_${snakeCase(
        key.toString()
      ).toUpperCase()}`
      return [key, process.env[variableName] ?? value]
    })
  )
}

export default defineNuxtModule({
  async setup(_options, nuxt) {
    nuxt.options.runtimeConfig = withSetupEnvironmentVariables(
      'NUXT',
      nuxt.options.runtimeConfig
    )
  },
})
