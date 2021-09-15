<template>
  <widgets-three-hour-forecast />
</template>

<script setup lang="ts">
import { setConfiguration } from '~/ts/configurationControllers'
import ThreeHourForecastConfiguration from '~/ts/threeHourForecastConfiguration'

setConfiguration(ThreeHourForecastConfiguration)
</script>
