<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">{{ title }}</div>
      <weather-item v-for="(item, i) in forecast" :key="i" :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'

import significantWeatherCodes from '~/ts/codeToWeatherInformation'
import exampleThreeHours from '~/ts/exampleThreeHours'
import definitions from '~/ts/threeHourSchema'

const getWeatherInformation = (code: number) => significantWeatherCodes[code]

export default defineComponent({
  setup() {
    const rawData = ref<definitions['Properties']>({
      requestPointDistance: 0,
      modelRunDate: '?',
      timeSeries: [],
    })
    const longitude = ref(52.2018)
    const latitude = ref(0.1144)

    const title = computed(() => {
      const { location } = rawData.value

      if (location === undefined) {
        return ''
      }

      const { name } = location
      const [shortenedName] = name.split(',')
      return `${shortenedName.toLowerCase()} weather`
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

    return {
      rawData,
      longitude,
      latitude,
      title,
      forecast,
    }
  },
})
</script>

<style src="@/node_modules/weather-icons/css/weather-icons.min.css" />
