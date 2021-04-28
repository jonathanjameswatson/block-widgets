<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">Weather forecast</div>
      <i class="wi wi-night-sleet"></i>
    </div>
  </div>
</template>

<script>
import significantWeatherCodes from '~/significantweather.js'
import exampleThreeHours from '~/examplethreehours'

export default {
  data() {
    return {
      longitude: 52.2018,
      latitude: 0.1144,
      rawData: exampleThreeHours,
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
