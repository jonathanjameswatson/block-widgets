import {
  configurationProperties,
  Configuration,
} from '~/ts/configurations/configuration'

export const useConfiguration = <T extends Configuration = Configuration>() =>
  useState<T>(
    'configuration',
    () => configurationProperties['configuration'].factory() as any
  )
