<template>
  <div class="my-px w-full max-w-full">
    <WidgetFocusable>
      <div class="flex items-center">
        <div class="flex-1 min-w-px py-3px pl-2px max-w-full">
          <div class="flex items-center">
            <slot />
          </div>
        </div>
      </div>
    </WidgetFocusable>
  </div>
</template>
