import WIDGET_URLS from '~/ts/widgetUrls'
import Configuration from '~/ts/configuration'

import ThreeHourForecast from '~/components/widgets/threeHourForecast.vue'
import ThreeHourForecastConfiguration from '~/ts/threeHourForecastConfiguration'

import Menu from '~/components/widgets/menu.vue'
import MenuConfiguration from '~/ts/menuConfiguration'

export interface Widget {
  name: string
  component: Vue.Component
  configuration: typeof Configuration
}

const widgets: { [url in typeof WIDGET_URLS[number]]: Widget } = {
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