<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">
        <widget-text :text="title" />
      </div>
      <div
        v-for="(menuItem, i) in menu"
        :key="i"
        class="text-sm leading-notion-outer min-h-notion flex items-center"
      >
        <div
          v-if="configuration.emojis"
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
          <widget-text :text="menuItem.name" />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import twemoji from 'twemoji'

import wordToFoodEmoji from '~/ts/wordToFoodEmoji'
import { getConfiguration } from '~/ts/configurationControllers'
import MenuConfiguration from '~/ts/menuConfiguration'

const keywords = Object.keys(wordToFoodEmoji)
const getEmoji = (string: string) => {
  const lowerString = string.toLowerCase()
  const keyword = keywords.find((x) => lowerString.includes(x))
  if (keyword === undefined) {
    return '❓'
  }
  return wordToFoodEmoji[keyword]
}

enum Weekday {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

interface ApiResponse {
  weekday: Weekday
  meal: 'Lunch' | 'Dinner' | 'Night' | 'Formal'
  menu: string[]
}

interface MenuItem {
  name: string
  emoji: string
}
</script>

<script setup lang="ts">
const configuration = getConfiguration<MenuConfiguration>()

const weekday = ref('')
const meal = ref('')
const menu = ref<MenuItem[]>([])
const failed = ref(false)

const { $axios } = useContext()
onMounted(async () => {
  const {
    weekday: weekdayNumber,
    meal: newMeal,
    menu: rawMenu,
  } = (await $axios.$get('/buttery/menu/').catch((_err) => {
    failed.value = true
    return {
      weekday: Weekday.Sunday,
      meal: 'Lunch',
      menu: [],
    }
  })) as ApiResponse

  if (failed.value === true) {
    return
  }

  weekday.value = Weekday[weekdayNumber].toLowerCase()
  meal.value = newMeal.toLowerCase()
  menu.value = rawMenu.map((menuItemName: string) => {
    return {
      name: menuItemName.toLowerCase(),
      emoji: twemoji.parse(getEmoji(menuItemName)),
    }
  })
})

const title = computed(() =>
  failed.value
    ? 'Could not access buttery bot'
    : `${weekday.value} ${meal.value}`
)
</script>
