<template>
  <div class="emoji">
    <div class="w-full h-full flex items-center justify-center">
      <div
        class="flex items-center justify-center"
        style="height: 22px; width: 22px"
      >
        <div class="emoji-inner">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.emoji {
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 4px;

  & .emoji-inner {
    width: 15.4px;
    height: 15.4px;
    font-size: 15.4px;
    line-height: 1.1;
    margin-left: 0px;
  }
}
</style>
