import { useRoute, useContext } from '@nuxtjs/composition-api'

import useConfiguration from '~/composables/useConfiguration'

import Configuration from '~/ts/configuration'

export const setConfiguration = <T extends Configuration>(Constructor: {
  new (): T
}) => {
  const configuration = useConfiguration<T>()
  const route = useRoute()
  const newConfiguration = new Constructor()
  newConfiguration.setFromParameterObject(route.value.query)
  configuration.value = newConfiguration
  const { $colorMode } = useContext()
  $colorMode.preference = configuration.value.theme.toLowerCase()
}
