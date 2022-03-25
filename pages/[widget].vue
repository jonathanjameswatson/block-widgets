<template>
  <div>
    <WidgetWrapper v-if="widgetComponent !== undefined">
      <component :is="widgetComponent" />
    </WidgetWrapper>
    <div
      v-else
      class="w-full min-h-screen p-8 bg-gray-100 flex flex-col justify-center text-center"
    >
      <div>
        <h1 class="text-blue-700 text-4xl font-bold mb-8">
          Widget not found...
        </h1>
        <NuxtLink to="/">
          <BlueButton class="flex-grow-0 mr-0">
            Click here to return
          </BlueButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WIDGET_URLS } from '~/ts/widgetUrls'
import { widgets } from '~/ts/vueDependent/widgets'

import type { Component } from 'vue'

const colorMode = useColorMode()
const configuration = useConfiguration()

watchEffect(() => {
  colorMode.preference = configuration.value.theme.toLowerCase()
})

const widgetComponent = ref<Component | undefined>()
const route = useRoute()

watchEffect(() => {
  const widgetName = route.params.widget

  if (typeof widgetName === 'string' && widgetName in widgets) {
    const { configuration: Constructor, component: newComponent } =
      widgets[widgetName as typeof WIDGET_URLS[number]]

    const newConfiguration = new Constructor()
    newConfiguration.setFromParameterObject(route.query)

    configuration.value = newConfiguration
    widgetComponent.value = newComponent
  }
})
</script>
