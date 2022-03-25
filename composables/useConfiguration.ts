import { Configuration } from '~/ts/vueDependent/configurations/configuration'

export const useConfiguration = <T extends Configuration = Configuration>() =>
  useState<T>('configuration', () => new Configuration() as any)
