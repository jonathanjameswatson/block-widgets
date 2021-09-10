<template>
  <div class="lg:flex w-full min-h-screen lg:h-screen bg-gray-100">
    <div
      class="
        lg:w-1/4
        lg:h-screen
        lg:inline-block
        bg-gray-200
        p-8
        pb-2
        overflow-y-auto
      "
    >
      <h1 class="text-blue-700 text-4xl font-bold mb-9">
        <a
          class="hover:text-blue-900"
          href="https://github.com/jonathanjameswatson/widgets"
          target="_blank"
          rel="noopener noreferrer"
        >
          jjw-widgets
        </a>
      </h1>

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

      <blue-control label="Link">
        <span class="flex">
          <blue-input class="flex-shrink" :value="url" disabled />
          <blue-button class="mr-0" :disabled="!canCopy" @click="copy">
            {{ copyText }}
          </blue-button>
        </span>
      </blue-control>
    </div>

    <div class="lg:inline-block lg:w-3/4 p-8 h-screen overflow-auto">
      <div class="w-full h-full flex justify-center">
        <div class="flex flex-col items-center self-center">
          <vue-draggable-resizable
            :w="343"
            :h="500"
            :min-width="20"
            :min-height="20"
            :active="true"
            :prevent-deactivation="true"
            :draggable="false"
            class-name="custom-resizable"
            class-name-handle="custom-handle"
            @resizing="() => (resizing = true)"
            @resizestop="() => (resizing = false)"
          >
            <div v-if="resizing" class="w-full h-full z-10 absolute" />
            <div class="widget-preview-container w-full h-full">
              <div
                v-if="preview === 'Normal'"
                class="widget-preview w-full h-full overflow-auto"
              >
                <widget-wrapper modify-css="widget-preview">
                  <component :is="widget.component" />
                </widget-wrapper>
              </div>
              <iframe
                v-else
                :src="queryPage"
                frameborder="0"
                sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
                class="w-full h-full"
              />
            </div>
          </vue-draggable-resizable>
        </div>
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

export default {
  layout: 'index',
}
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
const titleBase = ref('')
const canCopy = ref(false)
const copyText = ref('Copy')
const copyTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

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

onMounted(() => {
  titleBase.value = window.location.host

  if (navigator.clipboard) {
    canCopy.value = true
  }
})

const url = computed(() => `https://${titleBase.value}/${queryPage.value}`)

const copy = async () => {
  try {
    await navigator.clipboard.writeText(url.value)
    copyText.value = 'Copied'
  } catch {
    copyText.value = 'Could not copy'
  } finally {
    if (copyTimeout.value !== null) {
      clearTimeout(copyTimeout.value)
    }

    copyTimeout.value = setTimeout(() => {
      copyText.value = 'Copy'
      copyTimeout.value = null
    }, 2500)
  }
}
</script>

<style lang="postcss">
$radius: 0.25rem;
$border: 1rem;
$overlap: 0.5rem;

.custom-resizable {
  transform: translate(0px) !important;

  & .widget-preview-container {
    outline: 4px dashed rgb(29, 78, 216);
    outline-offset: 0px;
    border-radius: $radius;
    overflow: hidden;
  }
}

.custom-handle {
  position: absolute;
  height: $border;
  width: $border;

  &-tl {
    width: calc($border + $radius / 2);
    height: calc($border + $radius / 2);
    top: calc(-$border + $overlap);
    left: calc(-$border + $overlap);
    cursor: nw-resize;
  }

  &-tr {
    width: calc($border + $radius / 2);
    height: calc($border + $radius / 2);
    top: calc(-$border + $overlap);
    right: calc(-$border + $overlap);
    cursor: ne-resize;
  }

  &-bl {
    width: calc($border + $radius / 2);
    height: calc($border + $radius / 2);
    bottom: calc(-$border + $overlap);
    left: calc(-$border + $overlap);
    cursor: sw-resize;
  }

  &-br {
    width: calc($border + $radius / 2);
    height: calc($border + $radius / 2);
    bottom: calc(-$border + $overlap);
    right: calc(-$border + $overlap);
    cursor: se-resize;
  }

  &-tm {
    top: calc(-$border + $overlap);
    left: calc($overlap + $radius / 2);
    width: calc(100% - 2 * $overlap - $radius);
    cursor: n-resize;
  }

  &-bm {
    bottom: calc(-$border + $overlap);
    left: calc($overlap + $radius / 2);
    width: calc(100% - 2 * $overlap - $radius);
    cursor: s-resize;
  }

  &-ml {
    left: calc(-$border + $overlap);
    top: calc($overlap + $radius / 2);
    height: calc(100% - 2 * $overlap - $radius);
    cursor: w-resize;
  }

  &-mr {
    right: calc(-$border + $overlap);
    top: calc($overlap + $radius / 2);
    height: calc(100% - 2 * $overlap - $radius);
    cursor: e-resize;
  }
}

html,
body {
  @apply bg-gray-100 !important;
}
</style>
