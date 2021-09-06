<template>
  <three-hour-forecast-widget />
</template>

<script setup lang="ts">
import { setConfiguration } from '~/ts/configurationControllers'
import Configuration from '~/ts/configuration'

setConfiguration(Configuration)
</script>
