<template>
  <div class="p-6 w-full h-full">
    <div class="-mb-6">
      <div class="text-md mb-3 font-semibold">{{ weekday }} {{ meal }}</div>
      <div
        v-for="(menuItem, i) in menu"
        :key="i"
        class="text-sm leading-notion-outer flex items-center h-notion"
      >
        <p class="leading-notion-inner">
          {{ menuItem }}
        </p>
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
    const { weekday, meal, menu } = await this.$axios.$get('/buttery/menu/')
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
