<template>
  <widgets-menu />
</template>

<script setup lang="ts">
import { setConfiguration } from '~/ts/configurationControllers'
import MenuConfiguration from '~/ts/menuConfiguration'

setConfiguration(MenuConfiguration)
</script>
