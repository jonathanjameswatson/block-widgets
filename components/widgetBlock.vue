<template>
  <div class="my-px w-full max-w-full">
    <focusable>
      <div class="flex items-center">
        <div class="flex-1 min-w-px py-3px pl-2px">
          <div class="flex items-center">
            <slot />
          </div>
        </div>
      </div>
    </focusable>
  </div>
</template>
