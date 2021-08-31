<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">{{ title }}</div>
      <weather-item v-for="(item, i) in forecast" :key="i" :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import significantWeatherCodes from '~/ts/significantWeather'
import exampleThreeHours from '~/ts/exampleThreeHours'
import definitions from '~/ts/threeHourSchema'

declare interface Data {
  rawData: definitions["Properties"] | null
  longitude: number
  latitude: number
}

export default Vue.extend({
  data(): Data {
    return {
      rawData: null,
      longitude: 52.2018 as number,
      latitude: 0.1144,
    }
  },
  computed: {
    title(): string {
      const { location } = this.rawData
      if (location === undefined) {
        return ''
      }

      const { name } = location
      const [shortenedName] = name.split(',')
      return `${shortenedName.toLowerCase()} weather`
    },
    forecast() {
      const { timeSeries } = this.rawData
      if (timeSeries === undefined) {
        return []
      }

      return timeSeries.slice(0, 3).map((x) => {
        const { significantWeatherCode } = x
        const { icon } = this.getWeather(significantWeatherCode)
        return {
          icon,
        }
      })
    },
  },
  mounted() {
    this.setRawData()
  },
  methods: {
    getWeather(code: number) {
      return significantWeatherCodes[code]
    },
    setRawData() {
      const { features } = exampleThreeHours
      const [feature] = features
      const { properties: rawData } = feature

      this.rawData = rawData
    },
  },
})
</script>

<style src="@/assets/css/weather-icons.min.css" />
