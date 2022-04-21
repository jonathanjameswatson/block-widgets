<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <WidgetTitle :text="title" />
      <NuxtLink :to="metOfficeUrl" target="_blank">
        <WidgetBlock v-for="(weatherInformation, i) in forecast" :key="i">
          <WidgetEmojiContainer v-if="configuration.icons">
            <widget-weather-icon
              :icon="weatherInformation.icon"
              :name="weatherInformation.name"
            />
          </WidgetEmojiContainer>
          <WidgetText>
            <WidgetInline :text="weatherInformation.text" underline />
          </WidgetText>
        </WidgetBlock>
      </NuxtLink>
    </div>
    <WidgetWarning v-if="example" />
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import Geohash from 'latlon-geohash'

import { codeToWeatherInformation } from '~/ts/codeToWeatherInformation'
import { definitions } from '~/ts/threeHourSchema'

import { ThreeHourForecastConfiguration } from '~/ts/configurations/threeHourForecastConfiguration'

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
</script>

<script setup lang="ts">
const configuration = useConfiguration<ThreeHourForecastConfiguration>()

const geohash = computed(() =>
  Geohash.encode(configuration.value.latitude, configuration.value.longitude, 6)
)

const metOfficeUrl = computed(
  () => `https://www.metoffice.gov.uk/weather/forecast/${geohash.value}`
)

const exampleThreeHours = ref<definitions['SpotForecastFeatureCollection']>()

const title = computed(() => {
  if (data.value.rawData === undefined) {
    return 'Could not access Met Office'
  }

  const { location } = data.value.rawData

  if (location === undefined) {
    return ''
  }

  const { name } = location
  const [shortenedName] = name.split(',')
  return `${shortenedName} weather`
})

const forecast = computed(() => {
  if (data.value.rawData === undefined) {
    return []
  }

  const { timeSeries } = data.value.rawData

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

const example = computed(
  () =>
    configuration.value.proxy === '' ||
    configuration.value.configurationName !== 'threeHourForecastConfiguration'
)

interface Data {
  rawData?: definitions['Properties']
  startTime?: number
}

const hostFetch = useHostFetch()
const { data, refresh } = await useAsyncData<Data>(
  'threeHourForecastData',
  async (): Promise<Data> => {
    if (!example.value) {
      let response: definitions['SpotForecastFeatureCollection']

      try {
        response = await hostFetch<
          definitions['SpotForecastFeatureCollection']
        >(configuration.value.proxy, {
          params: {
            excludeParameterMetadata: true,
            includeLocationName: true,
            latitude: configuration.value.latitude,
            longitude: configuration.value.longitude,
          },
        })

        if (response.features === undefined) {
          throw new Error('Invalid payload given')
        }
      } catch (error) {
        return {
          rawData: undefined,
          startTime: undefined,
        }
      }

      const { features } = response
      const [feature] = features
      const { properties: rawData } = feature

      return {
        rawData,
        startTime: dayjs().utc().hour(),
      }
    } else {
      if (exampleThreeHours.value === undefined) {
        const { example } = (await import(
          '~/ts/exampleThreeHours.generated'
        )) as unknown as {
          example: definitions['SpotForecastFeatureCollection']
        }
        exampleThreeHours.value = example
      }
      const { features } = exampleThreeHours.value
      const [feature] = features
      const { properties: rawData } = feature

      return {
        rawData,
        startTime: undefined,
      }
    }
  },
  {
    watch: [() => configuration.value.proxy],
  }
)

useSchedule('5 */3 * * *', async () => {
  if (example.value || data.value.rawData === undefined) {
    return
  }

  if (
    data.value.startTime !== undefined &&
    dayjs().utc().hour() === data.value.startTime
  ) {
    return
  }

  data.value.startTime = undefined

  if (data.value.rawData.timeSeries.length > configuration.value.items) {
    data.value.rawData.timeSeries.shift()
    return
  }

  await refresh()
})
</script>
