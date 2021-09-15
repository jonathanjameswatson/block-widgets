import { inject, Ref } from '@nuxtjs/composition-api'

import Configuration from '~/ts/configuration'

export default <T extends Configuration = Configuration>() =>
  inject('configuration') as Ref<T>
