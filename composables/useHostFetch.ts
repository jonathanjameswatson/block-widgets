import { $fetch } from 'ohmyfetch'

export const useHostFetch = () => {
  const hostUrl = useRuntimeConfig().hostUrl
  return $fetch.create({
    async onRequest({ request, options }) {
      if (options.baseURL === undefined) {
        let url = ''

        if (typeof request === 'string') {
          url = request
        } else {
          url = request.url
        }

        if (!url.startsWith('http')) {
          options.baseURL = `${hostUrl}/api`
        }
      }
    },
  })
}
