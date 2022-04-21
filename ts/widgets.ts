import './configurations/progressBarsConfiguration'
import './configurations/threeHourForecastConfiguration'
import './configurations/menuConfiguration'

export interface Widget {
  name: string
  componentName: string
  configurationName: string
}

export const WIDGET_URLS = [
  'progressbars',
  'threehourforecast',
  'menu',
] as const

export const widgets: { [url in typeof WIDGET_URLS[number]]: Widget } = {
  progressbars: {
    name: 'Progress bars',
    componentName: 'WidgetsProgressBars',
    configurationName: 'progressBarsConfiguration',
  },
  threehourforecast: {
    name: 'Three hour forecast',
    componentName: 'WidgetsThreeHourForecast',
    configurationName: 'threeHourForecastConfiguration',
  },
  menu: {
    name: 'Buttery menu',
    componentName: 'WidgetsMenu',
    configurationName: 'menuConfiguration',
  },
}
