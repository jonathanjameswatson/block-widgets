<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="mb-3 font-semibold">
        <widget-text :text="title" />
      </div>
      <weather-item
        v-for="(weatherInformation, i) in forecast"
        :key="i"
        :weather-information="weatherInformation"
      />
    </div>
    <example-warning>Widget under construction</example-warning>
  </div>
</template>

<script lang="ts">
import codeToWeatherInformation from '~/ts/codeToWeatherInformation'
import exampleThreeHours from '~/ts/exampleThreeHours'
import definitions from '~/ts/threeHourSchema'

const getWeatherInformation = (code: number) => codeToWeatherInformation[code]
</script>

<script setup lang="ts">
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

  return timeSeries.slice(0, 3).map((x) => {
    const significantWeatherCode = x.significantWeatherCode as number
    const { icon } = getWeatherInformation(significantWeatherCode)
    return {
      icon,
    }
  })
})

onMounted(() => {
  const { features } = exampleThreeHours
  const [feature] = features
  const { properties: newData } = feature

  rawData.value = newData
})
</script>
