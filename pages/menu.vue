<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">{{ weekday }} {{ meal }}</div>
      <div
        v-for="(menuItem, i) in menu"
        :key="i"
        class="text-sm leading-notion-outer min-h-notion flex items-center"
      >
        <div
          class="flex flex-none items-center"
          style="height: 22px; width: 22px"
        >
          <div
            style="
              height: 15.4px;
              width: 15.4px;
              font-size: 15.4px;
              line-height: 1.1;
              margin-left: 0px;
              color: white;
              margin-right: 4px;
            "
            v-html="menuItem.emoji"
          ></div>
        </div>
        <p
          class="block leading-notion-inner border-b border-opacity-10 dark:border-opacity-10 border-notion-text dark:border-notion-text-dark my-notion-padding"
        >
          {{ menuItem.menuItem }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import twemoji from 'twemoji'
import emojiDict from '~/foodemojis.js'

const keywords = Object.keys(emojiDict)

export default {
  data() {
    return {
      weekday: '',
      meal: '',
      menu: [],
    }
  },
  async mounted() {
    const { weekday, meal, menu } = await this.$axios.$get('/buttery/menu/')
    this.weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][weekday]
    this.meal = meal
    this.menu = menu.map((menuItem) => {
      return {
        menuItem,
        emoji: twemoji.parse(this.getEmoji(menuItem)),
      }
    })
  },
  methods: {
    getEmoji(string) {
      const lowerString = string.toLowerCase()
      const keyword = keywords.find((x) => lowerString.includes(x)) || '❓'
      return emojiDict[keyword]
    },
  },
}
</script>
