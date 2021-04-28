<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">Weather forecast</div>
    </div>
  </div>
</template>

<script>
import significantWeatherCodes from '~/significantweather.js'
import exampleThreeHours from '~/examplethreehours'

export default {
  data() {
    return {
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
