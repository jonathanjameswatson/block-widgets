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
    <example-warning>Widget under construction</example-warning>
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
</script>

<script setup lang="ts">
const configuration = getConfiguration<ThreeHourForecastConfiguration>()

const rawData = ref<definitions['Properties']>({
  requestPointDistance: 0,
  modelRunDate: '?',
  timeSeries: [],
})
// const longitude = ref(52.2018)
// const latitude = ref(0.1144)

const title = computed(() => {
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
        probOfPrecipitation,
      }) => {
        const { icon, name } = getWeatherInformation(significantWeatherCode)
        const date = dayjs(time).format('Do: Ha')

        const text = `${date} - ${name}, ${Math.round(
          feelsLikeTemp
        )}°C, ${probOfPrecipitation}%`

        return {
          time,
          text,
          name,
          icon,
        }
      }
    )
})

onMounted(() => {
  const { features } = exampleThreeHours
  const [feature] = features
  const { properties: newData } = feature

  rawData.value = newData
})
</script>
