<template>
  <div class="w-screen h-screen bg-gradient-to-tr from-orange to-red">
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
        src="menu"
        frameborder="0"
        sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin"
        class="w-full h-full"
      ></iframe>
    </vue-draggable-resizable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resizing: false,
    }
  },
}
</script>
