const proxies: { [proxy: string]: string } = {
  BUTTERY_BOT_PROXY: 'BUTTERY_BOT_URL',
  MET_OFFICE_THREE_HOUR_FORECAST_PROXY: 'MET_OFFICE_THREE_HOUR_FORECAST_URL',
}

export default (env: {
  [key: string]: string | undefined
}): { [proxy: string]: string } =>
  Object.fromEntries(
    Object.entries(proxies)
      .filter(([key, url]) => env[key] !== undefined && env[url] !== undefined)
      .map(([key, url]) => [env[key], env[url] as string])
  )
