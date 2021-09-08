<template>
  <div>
    <i class="wi text-4xl" :class="[`wi-${weatherInformation.icon}`]"></i>
  </div>
</template>

<script lang="ts">
import WeatherInformation from '~/ts/weatherInformation'

export default defineComponent({
  props: {
    weatherInformation: {
      type: Object as () => WeatherInformation,
      required: true,
    },
  },
})
</script>

<style scoped src="@/assets/css/weather.css" />
