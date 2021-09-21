<template>
  <div>
    <div v-if="widgetComponent !== null">
      <component :is="widgetComponent" />
    </div>
    <div v-else>Component not found</div>
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
