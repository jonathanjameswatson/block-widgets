<template>
  <div
    class="
      w-full
      min-h-screen
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
        <p class="text-blue-700 font-bold mr-2 mb-2">Widget</p>
        <p class="mb-4">
          <blue-select
            :options="Object.values(Page)"
            :option-names="['Buttery menu', 'Three hour forecast']"
            :value="page"
            @input="(event) => (page = event)"
          />
        </p>

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
          <div v-if="resizing" class="w-full h-full z-10 absolute"></div>
          <iframe
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
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'

import Configuration from '~/ts/configuration'
import stringifyQuery from '~/ts/stringifyQuery'

enum Page {
  Menu = 'menu',
  ThreeHourForecast = 'threehourforecast',
}

export default defineComponent({
  setup() {
    const page = ref(Page.Menu)
    const resizing = ref(false)
    const configuration = ref(new Configuration())

    const queryPage = computed(() => {
      const parameterObject = configuration.value.toParameterObject() as {
        [key: string]: string
      }
      const queryString = stringifyQuery(parameterObject)
      return `${page.value}${queryString}`
    })

    return {
      page,
      queryPage,
      resizing,
      Page,
      configuration,
      stringifyQuery,
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
