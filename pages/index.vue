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
    <h1 class="extravagant-title mb-12 flex-initial">
      {{ `https://jjw-widgets.netlify.app/${queryPage}` }}
    </h1>

    <div class="flex flex-1">
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

        <configurator :configuration="configuration" />
      </div>
      <div class="flex-auto">
        <vue-draggable-resizable
          :w="600"
          :h="300"
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
            class="widget-preview min-w-full min-h-full overflow-auto"
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
import {
  defineComponent,
  ref,
  computed,
  watch,
  inject,
  Ref,
  useContext,
} from '@nuxtjs/composition-api'

import ThreeHourForecast from './threehourforecast.vue'
import Menu from '~/components/menuWidget.vue'

import Configuration from '~/ts/configuration'
import MenuConfiguration from '~/ts/menuConfiguration'
import stringifyQuery from '~/ts/stringifyQuery'

interface Widget {
  name: string
  url: string
  component: Vue.Component
  configuration: typeof Configuration
}

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

type Preview = 'Normal' | 'iFrame'

export default defineComponent({
  setup() {
    const widget = ref(widgets[0])
    const resizing = ref(false)
    const configuration = inject('configuration') as Ref<Configuration>
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

    return {
      widget,
      widgets,
      queryPage,
      resizing,
      configuration,
      stringifyQuery,
      preview,
    }
  },
})
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
