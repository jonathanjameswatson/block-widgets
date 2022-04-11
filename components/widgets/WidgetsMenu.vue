<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <WidgetTitle :text="title" />
      <NuxtLink
        to="https://www.queens.cam.ac.uk/life-at-queens/catering/cafeteria/cafeteria-menu"
        target="_blank"
      >
        <WidgetBlock v-for="(menuItem, i) in menu" :key="i">
          <WidgetEmojiContainer v-if="configuration.emojis">
            <img
              class="w-full h-full"
              draggable="false"
              :alt="menuItem.emoji"
              :src="menuItem.emojiUrl"
            />
          </WidgetEmojiContainer>
          <WidgetText>
            <WidgetInline :text="menuItem.name" underline />
          </WidgetText>
        </WidgetBlock>
      </NuxtLink>
    </div>
    <WidgetWarning v-if="example" />
  </div>
</template>

<script lang="ts">
import twemoji from 'twemoji'

import { wordToFoodEmoji } from '~/ts/wordToFoodEmoji.generated'
import { MenuConfiguration } from '~/ts/configurations/menuConfiguration'

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

const configuration = useConfiguration<MenuConfiguration>()

const weekday = ref('')
const meal = ref('')
const rawMenu = ref<string[]>([])
const failed = ref(false)

const example = computed(
  () =>
    configuration.value.butteryBotUrl === '' ||
    configuration.value.configurationName !== 'menuConfiguration'
)
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
      } = (await $fetch(
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

    weekday.value = Weekday[weekdayNumber]
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

const update = async () => {
  if (example.value) {
    return
  }

  await setData()
}

onMounted(async () => {
  await setData()
})

useSchedule('5 1,15 * * *', update)

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