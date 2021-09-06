import { inject, useRoute, useContext, Ref } from '@nuxtjs/composition-api'

import Configuration from '~/ts/configuration'

export const getConfiguration = <T extends Configuration = Configuration>() => {
  return inject('configuration') as Ref<T>
}

export const setConfiguration = <T extends Configuration>(Constructor: {
  new (): T
}) => {
  const configuration = getConfiguration<T>()
  const route = useRoute()
  const newConfiguration = new Constructor()
  newConfiguration.setFromParameterObject(route.value.query)
  configuration.value = newConfiguration
  const { $colorMode } = useContext()
  $colorMode.preference = configuration.value.theme.toLowerCase()
}
