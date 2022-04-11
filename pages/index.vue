<template>
  <div class="lg:flex w-full min-h-screen lg:h-screen bg-gray-100">
    <div
      class="lg:w-1/4 lg:h-screen lg:inline-block bg-gray-200 p-8 pb-2 overflow-y-auto"
    >
      <h1 class="text-blue-700 hover:text-blue-900 text-4xl font-bold mb-8">
        <NuxtLink
          class="hover:text-blue-900"
          to="https://github.com/jonathanjameswatson/block-widgets"
          target="_blank"
        >
          <span>BlockWidgets</span>
        </NuxtLink>
      </h1>

      <BlueControl label="Widget">
        <BlueSelect
          v-model="widgetUrl"
          :options="WIDGET_URLS"
          :option-names="widgetNames"
          min-width="21ch"
        />
      </BlueControl>

      <BlueControl label="Preview">
        <BlueSelect
          v-model="preview"
          :options="['Normal', 'iFrame']"
          min-width="11ch"
        />
      </BlueControl>

      <BlueConfigurator />

      <BlueControl label="Link">
        <span class="flex">
          <BlueInput
            class="flex-shrink opacity-100 cursor-text"
            :model-value="url"
            disabled
          />
          <BlueButton class="mr-0" :disabled="!canCopy" @click="copy">
            {{ copyText }}
          </BlueButton>
        </span>
      </BlueControl>
    </div>

    <div class="lg:inline-block lg:w-3/4 p-8 h-screen overflow-auto">
      <div class="w-full h-full flex justify-center">
        <div class="flex flex-col items-center self-center">
          <ClientOnly>
            <VueDraggableResizable
              :w="343"
              :h="500"
              :min-width="20"
              :min-height="20"
              :active="true"
              :prevent-deactivation="true"
              :draggable="false"
              @resizing="() => (resizing = true)"
              @resizestop="() => (resizing = false)"
            >
              <div v-if="resizing" class="w-full h-full z-10 absolute" />
              <div
                class="inline border-blue absolute -top-10 w-0 whitespace-nowrap"
              >
                <p class="text-blue-700 font-bold text-lg">
                  Drag outline to resize preview
                </p>
              </div>
              <div class="widget-preview-container w-full h-full">
                <div
                  v-if="preview === 'Normal'"
                  class="w-full h-full transform overflow-hidden"
                >
                  <div
                    class="widget-preview w-full h-full overflow-auto relative"
                  >
                    <WidgetWrapper
                      v-if="widgetComponent !== undefined"
                      modify-css="widget-preview"
                    >
                      <component :is="widgetComponent" />
                    </WidgetWrapper>
                  </div>
                </div>
                <iframe
                  v-else
                  :src="queryPage"
                  frameborder="0"
                  sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
                  class="w-full h-full"
                />
              </div>
            </VueDraggableResizable>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { stringifyQuery } from 'vue-router'

import { WIDGET_URLS, widgets } from '~/ts/widgets'
import { narrowingIncludes } from '~/ts/helpers/typeHelpers'
import { configurationProperties } from '~/ts/configurations/configuration'

import { ConcreteComponent } from 'vue'

const defaultUrl = WIDGET_URLS[0]
</script>

<script setup lang="ts">
// Route and NuxtApp

const route = useRoute()
const nuxtApp = useNuxtApp()

// Widget

const widgetNames = WIDGET_URLS.map((widgetUrl) => widgets[widgetUrl].name)

const widgetUrl = computed<typeof WIDGET_URLS[number]>({
  get() {
    const { widget: queryWidgetUrl } = route.query
    if (narrowingIncludes(WIDGET_URLS, queryWidgetUrl)) {
      return queryWidgetUrl
    } else {
      return defaultUrl
    }
  },
  set(value) {
    const { widget: queryWidgetUrl } = route.query
    if (queryWidgetUrl !== value) {
      if (queryWidgetUrl === undefined && value === defaultUrl) {
        navigateTo({ query: { ...route.query, widget: value } })
      } else {
        navigateTo({ query: { widget: value } })
      }
    }
  },
})

const widget = computed(() => widgets[widgetUrl.value])

// Configuration

const configuration = useConfiguration()
const parameterObject = computed(() => {
  const { configurationName } = widget.value
  return configurationProperties[configurationName].toParameterObject(
    configuration.value
  )
})
const widgetComponent = shallowRef<string | ConcreteComponent | undefined>()

watchEffect(() => {
  const { configurationName, componentName } = widget.value
  const newConfiguration = configurationProperties[configurationName].factory()
  configurationProperties[configurationName].setFromParameterObject(
    newConfiguration,
    route.query as any
  )
  configuration.value = newConfiguration
  widgetComponent.value = componentName // resolveComponent(componentName)
})

watch(
  parameterObject,
  () => {
    if (
      Object.keys(route.query).length !== 0 ||
      Object.keys(parameterObject.value).length !== 0
    )
      navigateTo({
        hash: route.hash,
        query: {
          ...(parameterObject.value as any),
          widget: route.query.widget,
        },
      })
  },
  { deep: true }
)

// URL

const queryPage = computed(() => {
  const queryString = stringifyQuery(parameterObject.value as any)
  if (queryString.length > 0) {
    return `${widgetUrl.value}?${queryString}`
  } else {
    return widgetUrl.value
  }
})

const protocol =
  nuxtApp.ssrContext === undefined
    ? window.location.protocol
    : nuxtApp.ssrContext.req.headers['x-forwarded-proto'] === undefined
    ? 'http:'
    : 'https:'
const host =
  nuxtApp.ssrContext === undefined
    ? window.location.host
    : nuxtApp.ssrContext.req.headers.host

const url = computed(() => `${protocol}//${host}/${queryPage.value}`)

// Colour theme

const colorMode = useColorMode()
watch(
  () => configuration.value.theme,
  (newTheme: string, oldTheme: string) => {
    if (newTheme !== oldTheme) {
      colorMode.preference = newTheme.toLowerCase()
    }
  }
)

// URL Copying

const canCopy = useState('canCopy', () => false)
const copyText = useState('copyText', () => 'Copy')
const copyTimeout = useState<ReturnType<typeof setTimeout> | undefined>(
  'copyTimeout',
  () => undefined
)

onMounted(() => {
  if (navigator.clipboard) {
    canCopy.value = true
  }
})

const copy = async () => {
  try {
    await navigator.clipboard.writeText(url.value)
    copyText.value = 'Copied'
  } catch {
    copyText.value = 'Could not copy'
  } finally {
    if (copyTimeout.value !== undefined) {
      clearTimeout(copyTimeout.value)
    }

    copyTimeout.value = setTimeout(() => {
      copyText.value = 'Copy'
      copyTimeout.value = undefined
    }, 2500)
  }
}

// Preview

const preview = useState<'Normal' | 'iFrame'>('preview', () => 'Normal')

// Resizing

const resizing = useState('resizing', () => false)
</script>

<style scoped lang="postcss">
.v3dr {
  transform: translate(0px) !important;

  & .widget-preview-container {
    outline: 4px dashed rgb(29, 78, 216);
    outline-offset: 0px;
    border-radius: theme('spacing.drag-radius');
    overflow: hidden;
  }

  &:deep(.handle) {
    position: absolute;
    height: theme('spacing.drag-border');
    width: theme('spacing.drag-border');

    &-tl {
      width: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      height: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      top: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      left: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      cursor: nw-resize;
    }

    &-tr {
      width: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      height: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      top: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      right: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      cursor: ne-resize;
    }

    &-bl {
      width: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      height: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      bottom: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      left: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      cursor: sw-resize;
    }

    &-br {
      width: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      height: calc(
        theme('spacing.drag-border') + theme('spacing.drag-radius') / 2
      );
      bottom: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      right: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      cursor: se-resize;
    }

    &-tm {
      top: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      left: calc(
        theme('spacing.drag-overlap') + theme('spacing.drag-radius') / 2
      );
      width: calc(
        100% - 2 * theme('spacing.drag-overlap') - theme('spacing.drag-radius')
      );
      cursor: n-resize;
    }

    &-bm {
      bottom: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      left: calc(
        theme('spacing.drag-overlap') + theme('spacing.drag-radius') / 2
      );
      width: calc(
        100% - 2 * theme('spacing.drag-overlap') - theme('spacing.drag-radius')
      );
      cursor: s-resize;
    }

    &-ml {
      left: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      top: calc(
        theme('spacing.drag-overlap') + theme('spacing.drag-radius') / 2
      );
      height: calc(
        100% - 2 * theme('spacing.drag-overlap') - theme('spacing.drag-radius')
      );
      cursor: w-resize;
    }

    &-mr {
      right: calc(
        -1 * theme('spacing.drag-border') + theme('spacing.drag-overlap')
      );
      top: calc(
        theme('spacing.drag-overlap') + theme('spacing.drag-radius') / 2
      );
      height: calc(
        100% - 2 * theme('spacing.drag-overlap') - theme('spacing.drag-radius')
      );
      cursor: e-resize;
    }
  }
}

html,
body {
  @apply bg-gray-100 !important;
}
</style>
