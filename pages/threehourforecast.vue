<template>
  <three-hour-forecast-widget />
</template>

<script setup lang="ts">
import { setConfiguration } from '~/ts/configurationControllers'
import ThreeHourForecastConfiguration from '~/ts/threeHourForecastConfiguration'

setConfiguration(ThreeHourForecastConfiguration)
</script>
