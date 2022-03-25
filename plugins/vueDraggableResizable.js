import VueDraggableResizableTs from 'vue-draggable-resizable-ts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use({
    install(Vue) {
      Vue.component('VueDraggableResizable', VueDraggableResizableTs)
    },
  })
})
