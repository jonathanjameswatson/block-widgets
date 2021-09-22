<template>
  <div>
    <widget-wrapper v-if="widgetComponent !== null">
      <component :is="widgetComponent" />
    </widget-wrapper>
    <div
      v-else
      class="
        w-full
        min-h-screen
        p-8
        bg-gray-100
        flex flex-col
        justify-center
        text-center
      "
    >
      <div>
        <h1 class="text-blue-700 text-4xl font-bold mb-8">
          Widget not found...
        </h1>
        <nuxt-link to="/">
          <blue-button class="flex-grow-0 mr-0">
            Click here to return
          </blue-button>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useConfiguration from '~/composables/useConfiguration'

import WIDGET_URLS from '~/ts/widgetUrls'
import widgets from '~/ts/vueDependent/widgets'

const widgetComponent = ref<null | Vue.Component>(null)

const route = useRoute()
const widgetName = route.value.params.widget

if (widgetName in widgets) {
  const { configuration: Constructor, component: newComponent } =
    widgets[widgetName as typeof WIDGET_URLS[number]]
  const newConfiguration = new Constructor()
  newConfiguration.setFromParameterObject(route.value.query)
  const configuration = useConfiguration()
  configuration.value = newConfiguration

  const { $colorMode } = useContext()
  $colorMode.preference = configuration.value.theme.toLowerCase()

  widgetComponent.value = newComponent
}
</script>
