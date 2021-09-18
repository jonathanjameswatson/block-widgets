import { CronJob } from 'cron'

export default (expression: string, update: () => void) => {
  const schedule = ref<CronJob | null>(null)

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
    if (schedule.value !== null) {
      schedule.value.stop()
    }
  })
}
