<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">{{ locationName }} weather</div>
      <div v-for="(item, i) in forecast" :key="i">
        <i class="wi text-4xl" :class="[`wi-${item.icon}`]"></i>
      </div>
    </div>
  </div>
</template>

<script>
import significantWeatherCodes from '~/significantweather.js'
import exampleThreeHours from '~/examplethreehours'

export default {
  data() {
    const { features } = exampleThreeHours
    const [feature] = features
    const { properties } = feature
    const { location, timeSeries } = properties
    const { name } = location
    const [shortenedName] = name.split(',')

    const forecast = timeSeries.slice(0, 3).map((x) => {
      const { significantWeatherCode } = x
      const { icon } = this.getWeather(significantWeatherCode)
      return {
        icon,
      }
    })

    return {
      longitude: 52.2018,
      latitude: 0.1144,
      locationName: shortenedName,
      forecast,
    }
  },
  async mounted() {},
  methods: {
    getWeather(code) {
      return significantWeatherCodes[code]
    },
  },
}
</script>

<style scoped src="@/assets/css/weather-icons.min.css" />
