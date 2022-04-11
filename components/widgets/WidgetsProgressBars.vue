<template>
  <div class="w-full h-full">
    <div class="flex flex-col">
      <WidgetTitle :text="configuration.title" />
      <WidgetBlock v-for="textBlock in textBlocks" :key="textBlock.period">
        <WidgetText>
          <WidgetInline :text="textBlock.timeString" underline />
        </WidgetText>
      </WidgetBlock>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import duration, { Duration } from 'dayjs/plugin/duration'
import isLeapYear from 'dayjs/plugin/isLeapYear'

import { ProgressBarsConfiguration } from '~/ts/configurations/progressBarsConfiguration'

dayjs.extend(duration)
dayjs.extend(isLeapYear)

const MONTH_LENGTHS = [
  31,
  () => (dayjs().isLeapYear() ? 29 : 28),
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
] as const

const PERIODS = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute'] as const
const PERIODS_ASCENDING = PERIODS.slice().reverse() as typeof PERIODS[number][]

interface PeriodInformation {
  duration: Duration | (() => Duration)
  offset: () => Dayjs
}

const PERIOD_INFORMATION: {
  [period in typeof PERIODS[number]]: PeriodInformation
} = {
  Year: {
    duration() {
      const year = dayjs.duration(1, 'years')
      if (dayjs().isLeapYear()) {
        return year.add(dayjs.duration(1, 'days'))
      }
      return year
    },
    offset() {
      return dayjs().startOf('year')
    },
  },
  Month: {
    duration() {
      const month = dayjs().month()
      const monthLengthEither = MONTH_LENGTHS[month]
      const monthLength =
        typeof monthLengthEither === 'number'
          ? monthLengthEither
          : monthLengthEither()
      return dayjs.duration(monthLength, 'days')
    },
    offset() {
      return dayjs().startOf('month')
    },
  },
  Week: {
    duration: dayjs.duration(1, 'weeks'),
    offset() {
      return dayjs().startOf('week')
    },
  },
  Day: {
    duration: dayjs.duration(1, 'days'),
    offset() {
      return dayjs().startOf('day')
    },
  },
  Hour: {
    duration: dayjs.duration(1, 'hours'),
    offset() {
      return dayjs().startOf('hour')
    },
  },
  Minute: {
    duration: dayjs.duration(1, 'minutes'),
    offset() {
      return dayjs().startOf('minute')
    },
  },
} as const

interface TextBlock {
  period: typeof PERIODS[number]
  time: number
  timeString: string
}
</script>

<script setup lang="ts">
const configuration = useConfiguration<ProgressBarsConfiguration>()

const periodList = computed(() =>
  configuration.value.ascendingPeriods ? PERIODS_ASCENDING : PERIODS
)

const allowedPeriods = computed(() => {
  return [
    ...(configuration.value.minute ? ['Minute'] : []),
    ...(configuration.value.hour ? ['Hour'] : []),
    ...(configuration.value.day ? ['Day'] : []),
    ...(configuration.value.week ? ['Week'] : []),
    ...(configuration.value.month ? ['Month'] : []),
    ...(configuration.value.year ? ['Year'] : []),
  ]
})

const filteredPeriodList = computed(() =>
  periodList.value.filter((period) => allowedPeriods.value.includes(period))
)

const textBlocks = useState<TextBlock[]>('progressBarsTextBlocks', () => [])

const setData = () => {
  textBlocks.value = filteredPeriodList.value.map((period) => {
    const { duration: durationEither, offset } = PERIOD_INFORMATION[period]
    const duration =
      typeof durationEither === 'function'
        ? (durationEither as () => Duration)()
        : (durationEither as Duration)
    const time = dayjs().diff(offset()) / duration.asMilliseconds()
    return {
      period,
      time,
      timeString: `${period}: ${configuration.value.fullSymbol
        .repeat(Math.floor((configuration.value.numberOfSymbols + 1) * time))
        .padEnd(
          configuration.value.numberOfSymbols,
          configuration.value.emptySymbol
        )}`,
    }
  })
}

setData()

onMounted(setData)

useSchedule('* * * * * *', setData)

watch(
  [
    () => configuration.value.fullSymbol,
    () => configuration.value.emptySymbol,
    () => configuration.value.numberOfSymbols,
    () => configuration.value.ascendingPeriods,
    () => configuration.value.minute,
    () => configuration.value.hour,
    () => configuration.value.day,
    () => configuration.value.week,
    () => configuration.value.month,
    () => configuration.value.year,
  ],
  setData
)
</script>
