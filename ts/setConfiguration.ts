import { inject, useRoute, useContext } from '@nuxtjs/composition-api'

import Configuration from '~/ts/configuration'

export default (Creator: typeof Configuration) => {
  const configuration = inject('configuration') as any
  const route = useRoute()
  const newConfiguration = new Creator()
  newConfiguration.setFromParameterObject(route.value.query)
  configuration.value = newConfiguration
  const { $colorMode } = useContext()
  $colorMode.preference = configuration.value.theme.toLowerCase()
}
