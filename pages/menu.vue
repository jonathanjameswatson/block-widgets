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
          class="
            block
            leading-notion-inner
            border-b border-opacity-10
            dark:border-opacity-10
            border-notion-text
            dark:border-notion-text-dark
            my-notion-padding
          "
        >
          {{ menuItem.menuItem }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { useContext } from '@nuxtjs/composition-api'
import twemoji from 'twemoji'

import wordToFoodEmoji from '~/ts/wordToFoodEmoji'

const keywords = Object.keys(wordToFoodEmoji)

const getEmoji = (string: string) => {
  const lowerString = string.toLowerCase()
  const keyword = keywords.find((x) => lowerString.includes(x))
  if (keyword === undefined) {
    return '❓'
  }
  return wordToFoodEmoji[keyword]
}

export default defineComponent({
  setup() {
    const weekday = ref('')
    const meal = ref('')
    const menu = ref([])

    const { $axios } = useContext()
    onMounted(async () => {
      const {
        weekday: weekdayNumber,
        meal: newMeal,
        menu: rawMenu,
      } = await $axios.$get('/buttery/menu/')
      weekday.value = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][weekdayNumber].toLowerCase()
      meal.value = newMeal.toLowerCase()
      menu.value = rawMenu.map((menuItem: string) => {
        return {
          menuItem: menuItem.toLowerCase(),
          emoji: twemoji.parse(getEmoji(menuItem)),
        }
      })
    })

    return {
      weekday,
      meal,
      menu,
    }
  },
})
</script>
