import { Module } from '@nuxt/types'

import WIDGET_URLS from '../../ts/widgetUrls'

const module: Module<{}> = function (_moduleOptions) {
  this.options.generate.routes = Object.assign([], WIDGET_URLS)
}

export default module
