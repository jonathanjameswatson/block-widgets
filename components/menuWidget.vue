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
    <example-warning v-if="example" />
  </div>
</template>

<script lang="ts">
import twemoji from 'twemoji'

import wordToFoodEmoji from '~/ts/wordToFoodEmoji.generated'
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
const rawMenu = ref<string[]>([])
const failed = ref(false)

const example = computed(() => configuration.value.butteryBotUrl === '')
const menu = computed<MenuItem[]>(() =>
  rawMenu.value.map((name: string) => {
    const emoji = configuration.value.emojis
      ? twemoji.parse(getEmoji(name))
      : ''
    return {
      name,
      emoji,
    }
  })
)

const { $axios } = useContext()
const setData = async () => {
  if (!example.value) {
    const {
      weekday: weekdayNumber,
      meal: newMeal,
      menu: newRawMenu,
    } = (await $axios
      .$get(`${configuration.value.butteryBotUrl}/menu/`)
      .catch((_err) => {
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
    rawMenu.value = newRawMenu
  } else {
    weekday.value = 'Monday'
    meal.value = 'Lunch'
    rawMenu.value = [
      'Soup of the Day',
      'Vegan - Aubergine Bolagnaise With Spaghetti',
      'Chicken, Leek & Sweetcorn Topcrust Pie',
      'New Potatoes',
      'Broccoli',
      'Apple and Blackberry Crumble',
    ]
  }
}

onMounted(setData)
watch(
  () => configuration.value.butteryBotUrl,
  async () => {
    weekday.value = ''
    meal.value = ''
    rawMenu.value = []
    await setData()
  }
)

const title = computed(() =>
  failed.value
    ? 'Could not access buttery bot'
    : `${weekday.value} ${meal.value}`
)
</script>
