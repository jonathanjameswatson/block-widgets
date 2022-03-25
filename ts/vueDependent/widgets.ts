import { WIDGET_URLS } from '~/ts/widgetUrls'
import { Configuration } from '~/ts/vueDependent/configurations/configuration'

import WidgetsProgressBars from '~/components/widgets/WidgetsProgressBars.vue'
import { ProgressBarsConfiguration } from '~/ts/vueDependent/configurations/progressBarsConfiguration'

import WidgetsThreeHourForecast from '~/components/widgets/WidgetsThreeHourForecast.vue'
import { ThreeHourForecastConfiguration } from '~/ts/vueDependent/configurations/threeHourForecastConfiguration'

import WidgetsMenu from '~/components/widgets/WidgetsMenu.vue'
import { MenuConfiguration } from '~/ts/vueDependent/configurations/menuConfiguration'

import type { Component } from 'vue'

export interface Widget {
  name: string
  component: Component
  configuration: typeof Configuration
}

export const widgets: { [url in typeof WIDGET_URLS[number]]: Widget } = {
  progressbars: {
    name: 'Progress bars',
    component: WidgetsProgressBars,
    configuration: ProgressBarsConfiguration,
  },
  threehourforecast: {
    name: 'Three hour forecast',
    component: WidgetsThreeHourForecast,
    configuration: ThreeHourForecastConfiguration,
  },
  menu: {
    name: 'Buttery menu',
    component: WidgetsMenu,
    configuration: MenuConfiguration,
  },
}
