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
      <h1 class="text-blue-700 text-4xl font-bold mb-8">
        <a
          class="hover:text-blue-900"
          href="https://github.com/jonathanjameswatson/block-widgets"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>BlockWidgets</span>
        </a>
      </h1>

      <blue-control label="Widget">
        <blue-select
          v-model="widgetUrl"
          :options="widgetUrls"
          :option-names="widgetNames"
          min-width="21ch"
        />
      </blue-control>

      <blue-control label="Preview">
        <blue-select
          v-model="preview"
          :options="['Normal', 'iFrame']"
          min-width="11ch"
        />
      </blue-control>

      <blue-configurator />

      <blue-control label="Link">
        <span class="flex">
          <blue-input
            class="flex-shrink opacity-100 cursor-text"
            :value="url"
            disabled
          />
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
                  <widget-wrapper modify-css="widget-preview">
                    <component :is="widget.component" />
                  </widget-wrapper>
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
          </vue-draggable-resizable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useConfiguration from '~/composables/useConfiguration'

import WIDGET_URLS from '~/ts/widgetUrls'
import widgets from '~/ts/vueDependent/widgets'
import stringifyQuery from '~/ts/stringifyQuery'
import { narrowingIncludes } from '~/ts/helpers/typeHelpers'

const defaultUrl = 'threehourforecast'
</script>

<script setup lang="ts">
// Router and route

const router = useRouter()
const route = useRoute()

// Widget

const widgetUrls = WIDGET_URLS
const widgetNames = widgetUrls.map((widgetUrl) => widgets[widgetUrl].name)

const widgetUrl = computed<typeof WIDGET_URLS[number]>({
  get() {
    const { hash } = route.value
    const hashEnd = hash.slice(1)
    if (narrowingIncludes(WIDGET_URLS, hashEnd)) {
      return hashEnd
    } else {
      return defaultUrl
    }
  },
  set(value) {
    const hash = `#${value}`
    if (route.value.hash !== hash) {
      router.replace({ hash })
    }
  },
})
const widget = computed(() => widgets[widgetUrl.value])

// Configuration

const NewConstructor = widget.value.configuration
const newConfiguration = new NewConstructor()
newConfiguration.setFromParameterObject(route.value.query)
const configuration = useConfiguration()
configuration.value = newConfiguration

watch(
  () => widget.value.configuration,
  () => {
    const NewConstructor = widget.value.configuration
    configuration.value = new NewConstructor()
  }
)

watch(
  configuration,
  () => {
    const query = configuration.value.toParameterObject()
    if (
      Object.keys(route.value.query).length !== 0 ||
      Object.keys(query).length !== 0
    )
      router.replace({
        hash: route.value.hash,
        query,
      })
  },
  { deep: true }
)

// URL

const queryPage = computed(() => {
  const parameterObject = configuration.value.toParameterObject() as {
    [key: string]: string
  }
  const queryString = stringifyQuery(parameterObject)
  return `${widgetUrl.value}${queryString}`
})

const protocol = ref('')
const titleBase = ref('')
onMounted(() => {
  protocol.value = window.location.protocol
  titleBase.value = window.location.host
})

const url = computed(
  () => `${protocol.value}//${titleBase.value}/${queryPage.value}`
)

// Colour theme

const { $colorMode } = useContext()
watch(
  () => configuration.value.theme,
  (newTheme: string, oldTheme: string) => {
    if (newTheme !== oldTheme) {
      $colorMode.preference = newTheme.toLowerCase()
    }
  }
)

// URL Copying

const canCopy = ref(false)
const copyText = ref('Copy')
const copyTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

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
    if (copyTimeout.value !== null) {
      clearTimeout(copyTimeout.value)
    }

    copyTimeout.value = setTimeout(() => {
      copyText.value = 'Copy'
      copyTimeout.value = null
    }, 2500)
  }
}

// Preview

const preview = ref<'Normal' | 'iFrame'>('Normal')

// Resizing

const resizing = ref(false)
</script>

<style lang="postcss">
$radius: 0.25rem;
$border: 1.5rem;
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
