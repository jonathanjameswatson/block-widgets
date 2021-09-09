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

<style scoped>
@import 'weather-icons/css/weather-icons.css';

@font-face {
  font-family: 'weathericons2';
  src: url('~/node_modules/weather-icons/font/weathericons-regular-webfont.eot');
  src: url('~/node_modules/weather-icons/font/weathericons-regular-webfont.eot?#iefix')
      format('embedded-opentype'),
    url('~/node_modules/weather-icons/font/weathericons-regular-webfont.woff2')
      format('woff2'),
    url('~/node_modules/weather-icons/font/weathericons-regular-webfont.woff')
      format('woff'),
    url('~/node_modules/weather-icons/font/weathericons-regular-webfont.ttf')
      format('truetype'),
    url('~/node_modules/weather-icons/font/weathericons-regular-webfont.svg#weather_iconsregular')
      format('svg');
  font-weight: normal;
  font-style: normal;
}

.wi {
  font-family: 'weathericons2' !important;
}
</style>
