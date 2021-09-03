import { inject, useRoute } from '@nuxtjs/composition-api'

import Configuration from '~/ts/configuration'

export default (Creator: typeof Configuration) => {
  const configuration = inject('configuration') as any
  const route = useRoute()
  const newConfiguration = new Creator()
  newConfiguration.setFromParameterObject(route.value.query)
  configuration.value = newConfiguration
}
