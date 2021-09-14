<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <widget-title :text="title" />
      <widget-block v-for="(menuItem, i) in menu" :key="i">
        <emoji-container v-if="configuration.emojis">
          <img
            class="w-full h-full"
            draggable="false"
            :alt="menuItem.emoji"
            :src="menuItem.emojiUrl"
          />
        </emoji-container>
        <p class="block leading-notion-inner">
          <widget-text
            :text="menuItem.name"
            class="border-b border-notion-border dark:border-notion-border-dark"
          />
        </p>
      </widget-block>
    </div>
    <example-warning v-if="example" />
  </div>
</template>

<script lang="ts">
import twemoji from 'twemoji'
import { RecurrenceRule, scheduleJob, Job } from 'node-schedule'
import { Ref } from '@nuxtjs/composition-api'

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

const getEmojiUrl = (emoji: string) => {
  let url = ''
  twemoji.parse(emoji, {
    callback(icon: string, options: object) {
      url = ''.concat(
        // @ts-ignore
        options.base,
        // @ts-ignore
        options.size,
        '/',
        icon,
        // @ts-ignore
        options.ext
      )

      return url
    },
  })
  return url
}

interface MenuItem {
  name: string
  emoji: string
  emojiUrl: string
}

const rule = new RecurrenceRule()
rule.hour = [1, 15]
rule.minute = 5
rule.tz = 'Etc/GMT'
</script>

<script setup lang="ts">
enum Weekday {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

type Meal = 'Lunch' | 'Dinner' | 'Night' | 'Formal'

interface ApiResponse {
  weekday: Weekday
  meal: Meal
  menu: string[]
}

const configuration = getConfiguration<MenuConfiguration>()

const weekday = ref('')
const meal = ref('')
const rawMenu = ref<string[]>([])
const failed = ref(false)
const schedule: Ref<Job | null> = ref(null)

const example = computed(() => configuration.value.butteryBotUrl === '')
const menu = computed<MenuItem[]>(() =>
  rawMenu.value.map((name: string) => {
    const emoji = configuration.value.emojis ? getEmoji(name) : ''
    const emojiUrl = getEmojiUrl(emoji)
    return {
      name,
      emoji,
      emojiUrl,
    }
  })
)

const { $axios } = useContext()
const setData = async () => {
  if (!example.value) {
    let weekdayNumber: Weekday
    let newMeal: Meal
    let newRawMenu: string[]

    try {
      ;({
        weekday: weekdayNumber,
        meal: newMeal,
        menu: newRawMenu,
      } = (await $axios.$get(
        `${configuration.value.butteryBotUrl}/menu/`
      )) as ApiResponse)

      if (weekdayNumber === undefined) {
        throw new Error('Invalid payload given')
      }

      failed.value = false
    } catch {
      failed.value = true
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
      'Vegan - Aubergine Bolognaise With Spaghetti',
      'Chicken, Leek & Sweetcorn Topcrust Pie',
      'New Potatoes',
      'Broccoli',
      'Apple and Blackberry Crumble',
    ]
  }
}

onMounted(() => {
  schedule.value = scheduleJob(rule, setData)
  setData()
})

onBeforeUnmount(() => {
  if (schedule.value !== null) {
    schedule.value.cancel()
  }
})

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
