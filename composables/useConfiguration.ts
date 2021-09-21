import { inject, Ref } from '@nuxtjs/composition-api'

import Configuration from '~/ts/vueDependent/configurations/configuration'

export default <T extends Configuration = Configuration>() =>
  inject('configuration') as Ref<T>
