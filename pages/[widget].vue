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
import { WIDGET_URLS, widgets } from '~/ts/widgets'
import { configurationProperties } from '~/ts/configurations/configuration'

import type { ConcreteComponent } from 'vue'

const configuration = useConfiguration()

const widgetComponent = shallowRef<string | ConcreteComponent>()
const route = useRoute()

watchEffect(() => {
  const widgetName = route.params.widget

  if (typeof widgetName === 'string' && widgetName in widgets) {
    const { configurationName, componentName } =
      widgets[widgetName as typeof WIDGET_URLS[number]]

    const newConfiguration =
      configurationProperties[configurationName].factory()
    configurationProperties[configurationName].setFromParameterObject(
      newConfiguration,
      route.query as any
    )

    configuration.value = newConfiguration
    widgetComponent.value = componentName // resolveComponent(componentName)
  }
})

const colorMode = useColorMode()
watchEffect(() => {
  colorMode.preference = configuration.value.theme.toLowerCase()
})
</script>
