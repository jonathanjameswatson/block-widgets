<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <widget-title :text="title" />
      <widget-block v-for="(weatherInformation, i) in forecast" :key="i">
        <emoji-container v-if="configuration.icons">
          <weather-icon
            :icon="weatherInformation.icon"
            :name="weatherInformation.name"
          />
        </emoji-container>
        <p class="block leading-notion-inner">
          <widget-text
            :text="weatherInformation.text"
            class="border-b border-notion-border dark:border-notion-border-dark"
          />
        </p>
      </widget-block>
    </div>
    <example-warning v-if="example" />
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import codeToWeatherInformation from '~/ts/codeToWeatherInformation'
import exampleThreeHours from '~/ts/exampleThreeHours'
import definitions from '~/ts/threeHourSchema'
import { getConfiguration } from '~/ts/configurationControllers'
import ThreeHourForecastConfiguration from '~/ts/threeHourForecastConfiguration'

const getWeatherInformation = (code: number) => codeToWeatherInformation[code]
dayjs.extend(advancedFormat)

const celsiusGetters: {
  [type: string]: (temperatures: {
    feelsLike: number
    minimum: number
    maximum: number
  }) => number
} = {
  'Feels like': ({ feelsLike }) => feelsLike,
  Minimum: ({ minimum }) => minimum,
  Maximum: ({ maximum }) => maximum,
  Average: ({ minimum, maximum }) => (minimum + maximum) / 2,
}

const celsiusConverters: { [unit: string]: (celsius: number) => number } = {
  '°C': (celsius) => celsius,
  '°F': (celsius) => celsius * (9 / 5) + 32,
  K: (celsius) => celsius + 273.15,
}

const defaultRawData = {
  requestPointDistance: 0,
  modelRunDate: '?',
  timeSeries: [],
}
</script>

<script setup lang="ts">
const configuration = getConfiguration<ThreeHourForecastConfiguration>()

const rawData = ref<definitions['Properties']>(defaultRawData)
const failed = ref(false)

const title = computed(() => {
  if (failed.value) {
    return 'Could not access Met Office'
  }

  const { location } = rawData.value

  if (location === undefined) {
    return ''
  }

  const { name } = location
  const [shortenedName] = name.split(',')
  return `${shortenedName} weather`
})

const forecast = computed(() => {
  const { timeSeries } = rawData.value

  return timeSeries
    .slice(0, configuration.value.items)
    .map(
      ({
        significantWeatherCode,
        time,
        feelsLikeTemp,
        minScreenAirTemp,
        maxScreenAirTemp,
        probOfPrecipitation,
      }) => {
        const { icon, name } = getWeatherInformation(significantWeatherCode)
        const timeFormat =
          configuration.value.timeFormat !== ''
            ? configuration.value.timeFormat
            : 'Do: Ha'
        const date = dayjs(time).format(timeFormat)
        const celsius = celsiusGetters[configuration.value.temperatureType]({
          feelsLike: feelsLikeTemp,
          minimum: minScreenAirTemp,
          maximum: maxScreenAirTemp,
        })
        const temperature =
          celsiusConverters[configuration.value.temperatureUnit](celsius)

        const text = `${date} - ${name}, ${Math.round(temperature)}${
          configuration.value.temperatureUnit
        }, ${probOfPrecipitation}%`

        return {
          time,
          text,
          name,
          icon,
        }
      }
    )
})

const example = computed(() => configuration.value.endpoint === '')

const { $axios } = useContext()
const setData = async () => {
  if (!example.value) {
    let response: definitions['SpotForecastFeatureCollection']

    try {
      response = (await $axios.$get(configuration.value.endpoint, {
        headers: {
          'X-IBM-Client-Id': configuration.value.clientId,
          'X-IBM-Client-Secret': configuration.value.clientSecret,
        },
        params: {
          excludeParameterMetadata: true,
          includeLocationName: true,
          latitude: configuration.value.latitude,
          longitude: configuration.value.longitude,
        },
      })) as definitions['SpotForecastFeatureCollection']

      if (response.features === undefined) {
        throw new Error('Invalid payload given')
      }

      failed.value = false
    } catch {
      failed.value = true
      return
    }

    const { features } = response
    const [feature] = features
    const { properties: newData } = feature

    rawData.value = newData
  } else {
    const { features } = exampleThreeHours
    const [feature] = features
    const { properties: newData } = feature

    rawData.value = newData
  }
}

watch(
  [
    () => configuration.value.endpoint,
    () => configuration.value.clientId,
    () => configuration.value.clientSecret,
  ],
  async () => {
    rawData.value = defaultRawData
    await setData()
  }
)

onMounted(() => {
  setData()
})
</script>
