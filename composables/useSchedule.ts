import { CronJob } from 'cron'

export const useSchedule = (expression: string, update: () => void) => {
  const schedule = ref<CronJob | undefined>()

  onMounted(() => {
    schedule.value = new CronJob(
      expression,
      update,
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      0
    )
  })

  onBeforeUnmount(() => {
    if (schedule.value !== undefined) {
      schedule.value.stop()
      schedule.value = undefined
    }
  })
}
