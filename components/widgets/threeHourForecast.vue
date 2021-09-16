<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <widget-title :text="title" />
      <widget-block v-for="(weatherInformation, i) in forecast" :key="i">
        <widget-emoji-container v-if="configuration.icons">
          <widget-weather-icon
            :icon="weatherInformation.icon"
            :name="weatherInformation.name"
          />
        </widget-emoji-container>
        <widget-text>
          <widget-span :text="weatherInformation.text" underline />
        </widget-text>
      </widget-block>
    </div>
    <widget-warning v-if="example" />
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'

import useConfiguration from '~/composables/useConfiguration'
import useSchedule from '~/composables/useSchedule'

import codeToWeatherInformation from '~/ts/codeToWeatherInformation'
import definitions from '~/ts/threeHourSchema'

import ThreeHourForecastConfiguration from '~/ts/threeHourForecastConfiguration'

dayjs.extend(advancedFormat)
dayjs.extend(utc)

const getWeatherInformation = (code: number) => codeToWeatherInformation[code]

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
const configuration = useConfiguration<ThreeHourForecastConfiguration>()

const rawData = ref<definitions['Properties']>(defaultRawData)
const failed = ref(false)
const startTime = ref<number | null>(null)
const exampleThreeHours =
  ref<definitions['SpotForecastFeatureCollection'] | null>(null)

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
        const { icon, display, name } = getWeatherInformation(
          significantWeatherCode
        )
        const timeFormat =
          configuration.value.timeFormat !== ''
            ? configuration.value.timeFormat
            : 'Do: ha'
        const date = dayjs(time).format(timeFormat)
        const celsius = celsiusGetters[configuration.value.temperatureType]({
          feelsLike: feelsLikeTemp,
          minimum: minScreenAirTemp,
          maximum: maxScreenAirTemp,
        })
        const temperature =
          celsiusConverters[configuration.value.temperatureUnit](celsius)

        const text = `${date} - ${display}, ${Math.round(temperature)}${
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

      startTime.value = dayjs().utc().hour()

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
    if (exampleThreeHours.value === null) {
      const imported = (await import('~/ts/exampleThreeHours')) as unknown as {
        default: definitions['SpotForecastFeatureCollection']
      }
      exampleThreeHours.value = imported.default
    }
    const { features } = exampleThreeHours.value
    const [feature] = features
    const { properties: newData } = feature

    rawData.value = newData
  }
}

const update = async () => {
  if (example.value) {
    return
  }

  if (startTime.value !== null && dayjs().utc().hour() === startTime.value) {
    return
  }

  startTime.value = null

  if (rawData.value.timeSeries.length > configuration.value.items) {
    rawData.value.timeSeries.shift()
    return
  }

  await setData()
}

onMounted(async () => {
  await setData()
})

useSchedule('5 */3 * * *', update)

watch(
  [
    () => configuration.value.endpoint,
    () => configuration.value.clientId,
    () => configuration.value.clientSecret,
  ],
  async () => {
    rawData.value = defaultRawData
    startTime.value = null
    await setData()
  }
)
</script>
