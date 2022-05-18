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

import { MenuConfiguration } from '~/ts/configurations/menuConfiguration'

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

const example = computed(
  () =>
    configuration.value.butteryBotUrl === '' ||
    configuration.value.configurationName !== 'menuConfiguration'
)
const menu = computed<MenuItem[]>(() =>
  data.value.rawMenu.map((nameAndEmoji: string) => {
    const characters = [...nameAndEmoji]
    const emoji = configuration.value.emojis ? characters[0] : ''
    const emojiUrl = getEmojiUrl(emoji)
    return {
      name: characters.slice(1).join(''),
      emoji,
      emojiUrl,
    }
  })
)

interface Data {
  weekday: Weekday | ''
  meal: Lowercase<Meal> | ''
  rawMenu: string[]
  failed: boolean
}

const hostFetch = useHostFetch()
const { data, refresh } = await useAsyncData<Data>(
  'menuData',
  async (): Promise<Data> => {
    if (!example.value) {
      let weekdayNumber: Weekday
      let newMeal: Meal
      let newRawMenu: string[]

      try {
        ;({
          weekday: weekdayNumber,
          meal: newMeal,
          menu: newRawMenu,
        } = await hostFetch<ApiResponse>(
          `${configuration.value.butteryBotUrl}/menu/`
        ))

        if (weekdayNumber === undefined) {
          throw new Error('Invalid payload given')
        }
      } catch {
        return {
          weekday: '',
          meal: '',
          rawMenu: [],
          failed: true,
        } as {
          weekday: Weekday | ''
          meal: Lowercase<Meal> | ''
          rawMenu: string[]
          failed: boolean
        }
      }

      return {
        weekday: Weekday[weekdayNumber] as unknown as Weekday,
        meal: newMeal.toLowerCase() as Lowercase<Meal>,
        rawMenu: newRawMenu,
        failed: false,
      }
    } else {
      return {
        weekday: Weekday[0] as unknown as Weekday,
        meal: 'lunch',
        rawMenu: [
          '🍲 Soup of the Day',
          '🍝 Vegan - Aubergine Bolognese With Spaghetti',
          '🥧 Chicken, Leek & Sweetcorn Topcrust Pie',
          '🥔 New Potatoes',
          '🥦 Broccoli',
          '🥣 Apple and Blackberry Crumble',
        ],
        failed: false,
      }
    }
  },
  {
    watch: [() => configuration.value.butteryBotUrl, example],
  }
)

useSchedule('5 1,15 * * *', async () => {
  if (!example.value) {
    await refresh()
  }
})

const title = computed(() =>
  data.value.failed
    ? 'Could not access buttery bot'
    : `${data.value.weekday} ${data.value.meal}`
)
</script>
