<template>
  <div class="p-6 w-full h-full">
    <div>
      <div class="text-md mb-4 font-semibold">{{ weekday }} {{ meal }}</div>
      <div
        v-for="(menuItem, i) in menu"
        :key="i"
        class="text-sm my-2 p-1 border-2 border-notion-text dark:border-notion-text-dark rounded"
      >
        {{ menuItem }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekday: '',
      meal: '',
      menu: [],
    }
  },
  async mounted() {
    const { weekday, meal, menu } = await this.$axios.$get(
      this.dev
        ? 'https://????????????????????????????/menu/'
        : '/buttery/menu/',
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    )
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
    this.menu = menu
  },
}
</script>
