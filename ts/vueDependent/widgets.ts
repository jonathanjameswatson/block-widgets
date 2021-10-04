import WIDGET_URLS from '~/ts/widgetUrls'
import Configuration from '~/ts/vueDependent/configurations/configuration'

import ProgressBars from '~/components/widgets/progressBars.vue'
import ProgressBarsConfiguration from '~/ts/vueDependent/configurations/progressBarsConfiguration'

import ThreeHourForecast from '~/components/widgets/threeHourForecast.vue'
import ThreeHourForecastConfiguration from '~/ts/vueDependent/configurations/threeHourForecastConfiguration'

import Menu from '~/components/widgets/menu.vue'
import MenuConfiguration from '~/ts/vueDependent/configurations/menuConfiguration'

export interface Widget {
  name: string
  component: Vue.Component
  configuration: typeof Configuration
}

const widgets: { [url in typeof WIDGET_URLS[number]]: Widget } = {
  progressbars: {
    name: 'Progress bars',
    component: ProgressBars,
    configuration: ProgressBarsConfiguration,
  },
  threehourforecast: {
    name: 'Three hour forecast',
    component: ThreeHourForecast,
    configuration: ThreeHourForecastConfiguration,
  },
  menu: {
    name: 'Buttery menu',
    component: Menu,
    configuration: MenuConfiguration,
  },
}

export default widgets
