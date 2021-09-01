<template>
  <div class="w-screen h-screen bg-gradient-to-tr from-orange to-red">
    <h1 class="extravagant-title">
      https://jjw-widgets.netlify.app/{{ page }}
    </h1>
    <button class="extravagant-button" @click="() => (page = Page.Menu)">
      Buttery menu
    </button>
    <button
      class="extravagant-button"
      @click="() => (page = Page.ThreeHourForecast)"
    >
      Three hour forecast
    </button>

    <br /><br />

    <configurator :configuration="configuration" />

    <br /><br />

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
        :src="page"
        frameborder="0"
        sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
        class="w-full h-full"
      ></iframe>
    </vue-draggable-resizable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

import Configuration from '~/ts/configuration'

enum Page {
  Menu = 'menu',
  ThreeHourForecast = 'threehourforecast',
}

export default defineComponent({
  setup() {
    const page = ref(Page.Menu)
    const resizing = ref(false)
    const configuration = ref(new Configuration())

    return {
      page,
      resizing,
      Page,
      configuration,
    }
  },
})
</script>

<style scoped lang="postcss">
.extravagant-title {
  @apply transform-gpu text-6xl font-extrabold p-6 pt-0 pl-2 bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-600;

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
