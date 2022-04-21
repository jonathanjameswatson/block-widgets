import { $fetch } from 'ohmyfetch'

export const useHostFetch = () => {
  const hostUrl = useRuntimeConfig().hostUrl
  return $fetch.create({
    baseURL: `${hostUrl}/api`,
  })
}
