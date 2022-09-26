<template>
  <div ref="domElement" class="resizable" :style="style">
    <div
      v-for="handle in HANDLES"
      :key="handle"
      class="handle"
      :class="`handle-${handle}`"
      @mousedown.stop.prevent="handleDown(handle, $event)"
      @touchstart.stop.prevent="handleDown(handle, $event)"
    />
    <div class="inline border-blue absolute -top-10 w-0 whitespace-nowrap">
      <p class="text-blue-700 font-bold text-lg">
        Drag outline to resize preview
      </p>
    </div>
    <div
      v-if="resizeInformation !== undefined"
      class="w-full h-full z-10 absolute"
    />
    <div class="resizable-content block w-full h-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  minWidth: number
  minHeight: number
  width: number
  height: number
}>()

const emit = defineEmits<{
  (e: 'update:width', value: number): void
  (e: 'update:height', value: number): void
}>()

const HANDLES = ['tl', 'tm', 'tr', 'bl', 'bm', 'br', 'ml', 'mr'] as const

interface ResizeInformation {
  handle: typeof HANDLES[number]
  startX: number
  startY: number
  startWidth: number
  startHeight: number
  moveEvent: keyof DocumentEventMap
  endEvent: keyof DocumentEventMap
}

const resizeInformation = ref<ResizeInformation>()

const DIRECTIONS = {
  tl: { x: -1, y: -1 },
  tm: { x: 0, y: -1 },
  tr: { x: 1, y: -1 },
  bl: { x: -1, y: 1 },
  bm: { x: 0, y: 1 },
  br: { x: 1, y: 1 },
  ml: { x: -1, y: 0 },
  mr: { x: 1, y: 0 },
} as const

const getEventCoordinates = (event: MouseEvent | TouchEvent) => {
  if (event instanceof MouseEvent) {
    return {
      x: event.pageX,
      y: event.pageY,
    }
  } else {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    }
  }
}

const handleDown = (
  handle: typeof HANDLES[number],
  event: MouseEvent | TouchEvent
) => {
  if (event instanceof MouseEvent && event.button !== 0) {
    return
  }

  const { x: startX, y: startY } = getEventCoordinates(event)

  const moveEvent = event instanceof MouseEvent ? 'mousemove' : 'touchmove'
  const endEvent = event instanceof MouseEvent ? 'mouseup' : 'touchend'

  resizeInformation.value = {
    handle,
    startX,
    startY,
    startWidth: props.width,
    startHeight: props.height,
    moveEvent,
    endEvent,
  }

  document.addEventListener(moveEvent, handleMove)
  document.addEventListener(endEvent, handleEnd)
}

const handleMove = (event: MouseEvent | TouchEvent) => {
  if (resizeInformation.value === undefined) {
    return
  }

  const { handle, startX, startY, startWidth, startHeight } =
    resizeInformation.value
  const { x: currentX, y: currentY } = getEventCoordinates(event)
  const { x: directionX, y: directionY } = DIRECTIONS[handle]

  const deltaX = (currentX - startX) * directionX * 2
  const deltaY = (currentY - startY) * directionY * 2

  const newWidth = Math.max(props.minWidth, startWidth + deltaX)
  const newHeight = Math.max(props.minHeight, startHeight + deltaY)

  emit('update:width', newWidth)
  emit('update:height', newHeight)
}

const handleEnd = () => {
  if (resizeInformation.value === undefined) {
    return
  }

  const { moveEvent, endEvent } = resizeInformation.value

  document.removeEventListener(moveEvent, handleMove as any)
  document.removeEventListener(endEvent, handleEnd as any)

  resizeInformation.value = undefined
}

const domElement = ref<HTMLDivElement>()

const style = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
  }
})
</script>

<style scoped lang="postcss">
.resizable {
  transform: translate(0px) !important;

  & &-content {
    outline: 4px dashed rgb(29, 78, 216);
    outline-offset: 0px;
    border-radius: theme('spacing.drag-radius');
    overflow: hidden;
  }

  & .handle {
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
</style>
