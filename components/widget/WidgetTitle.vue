<template>
  <div class="mt-notion-title mb-px w-full max-w-full">
    <div class="w-full flex font-semibold text-notion-title leading-notion">
      <div class="my-3px mx-2px break-words w-full max-w-full">
        <WidgetInline :text="props.text" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>
