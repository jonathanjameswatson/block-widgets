<template>
  <div
    class="
      w-full
      min-h-screen
      p-4
      bg-gradient-to-tr
      from-orange
      to-red
      flex flex-col
    "
  >
    <h1 class="extravagant-title mb-12 w-full break-all flex-initial">
      {{ `https://jjw-widgets.netlify.app/${queryPage}` }}
    </h1>

    <div class="lg:flex flex-1">
      <div class="flex-initial pr-16">
        <blue-control label="Widget">
          <blue-select
            v-model="widget"
            :options="widgets"
            :option-names="widgets.map((widget) => widget.name)"
          />
        </blue-control>

        <blue-control label="Preview">
          <blue-select v-model="preview" :options="['Normal', 'iFrame']" />
        </blue-control>

        <configurator />
      </div>

      <hr class="mt-6 mb-8 border-blue-700 border-t-4 lg:hidden" />

      <div class="flex-auto" style="min-height: 500px">
        <vue-draggable-resizable
          :w="343"
          :h="500"
          :handles="['br']"
          :active="true"
          :prevent-deactivation="true"
          :parent="true"
          :draggable="false"
          @resizing="() => (resizing = true)"
          @resizestop="() => (resizing = false)"
        >
          <div v-if="resizing" class="w-full h-full z-10 absolute" />
          <div
            v-if="preview === 'Normal'"
            class="widget-preview w-full h-full overflow-auto"
          >
            <component :is="widget.component" />
          </div>
          <iframe
            v-else
            :src="queryPage"
            frameborder="0"
            sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
            class="w-full h-full"
          ></iframe>
        </vue-draggable-resizable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ThreeHourForecast from '~/components/threeHourForecastWidget.vue'
import Menu from '~/components/menuWidget.vue'

import Configuration from '~/ts/configuration'
import MenuConfiguration from '~/ts/menuConfiguration'
import stringifyQuery from '~/ts/stringifyQuery'
import { getConfiguration } from '~/ts/configurationControllers'

interface Widget {
  name: string
  url: string
  component: Vue.Component
  configuration: typeof Configuration
}

type Preview = 'Normal' | 'iFrame'
</script>

<script setup lang="ts">
const widgets: Widget[] = [
  {
    name: 'Buttery menu',
    url: 'menu',
    component: Menu,
    configuration: MenuConfiguration,
  },
  {
    name: 'Three hour forecast',
    url: 'threehourforecast',
    component: ThreeHourForecast,
    configuration: Configuration,
  },
]

const widget = ref(widgets[0])
const resizing = ref(false)
const configuration = getConfiguration()
const preview = ref<Preview>('Normal')

const queryPage = computed(() => {
  const parameterObject = configuration.value.toParameterObject() as {
    [key: string]: string
  }
  const queryString = stringifyQuery(parameterObject)
  return `${widget.value.url}${queryString}`
})

const StartConfiguration = widgets[0].configuration
configuration.value = new StartConfiguration()

watch(widget, () => {
  const WidgetConfiguration = widget.value.configuration
  configuration.value = new WidgetConfiguration()
})

const { $colorMode } = useContext()
watch(
  () => configuration.value.theme,
  (newTheme: string, oldTheme: string) => {
    if (newTheme !== oldTheme) {
      $colorMode.preference = newTheme.toLowerCase()
    }
  }
)
</script>

<style scoped lang="postcss">
.extravagant-title {
  @apply transform-gpu text-4xl font-extrabold p-6 pt-0 bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-600;

  animation-name: spin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 5s;
  text-align: center;
}

.extravagant-button {
  @apply bg-blue-500 hover:bg-blue-700 text-white rounded py-2 px-4 font-bold mr-2;
}

@keyframes spin {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
</style>
