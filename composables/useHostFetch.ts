import { $fetch } from 'ohmyfetch'

export const useHostFetch = () => {
  const { proxyUrl } = useRuntimeConfig()
  return $fetch.create({
    onRequest({ request, options }) {
      if (options.baseURL === undefined) {
        let url = ''

        if (typeof request === 'string') {
          url = request
        } else {
          url = request.url
        }

        if (!url.startsWith('http')) {
          options.baseURL = proxyUrl
        }
      }

      return Promise.resolve()
    },
  })
}
