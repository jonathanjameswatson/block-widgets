<template>
  <div :class="classes">
    <slot></slot>
    <div ref="customCssContainer" />
  </div>
</template>

<script setup lang="ts">
import { parse, walk, generate, fromPlainObject, CssNode } from 'css-tree'

import { getConfiguration } from '~/ts/configurationControllers'

const props = withDefaults(
  defineProps<{
    modifyCss: string | null
  }>(),
  {
    modifyCss: () => null,
  }
)

const configuration = getConfiguration()

const customCssContainer = ref<HTMLDivElement | null>(null)

const setStyle = (css: string) => {
  if (customCssContainer.value === null) {
    return
  }

  let newCss = css

  const modifyCss = props.modifyCss

  if (modifyCss !== null) {
    const ast = parse(css)
    walk(ast, {
      enter(node: CssNode) {
        if (node.type === 'Selector') {
          node.children.unshift({
            type: 'WhiteSpace',
            value: ' ',
          })
          node.children.unshift(
            fromPlainObject({
              type: 'Selector',
              children: [
                {
                  type: 'ClassSelector',
                  name: modifyCss,
                },
              ],
            })
          )
          // @ts-ignore
          return walk.skip
        }
      },
    })

    newCss = generate(ast)
  }

  const style = document.createElement('style')
  style.appendChild(document.createTextNode(newCss))
  customCssContainer.value.innerHTML = ''
  customCssContainer.value.appendChild(style)
}

watch(
  () => configuration.value.css,
  (css: string) => setStyle(css)
)

onMounted(() => setStyle(configuration.value.css))

const classes = computed(() => {
  const fontFamily = `font-${configuration.value.style.toLowerCase()}`
  const fontSize = `text-notion-${
    configuration.value.textSize ? 'small' : 'normal'
  }`

  return [fontFamily, fontSize]
})
</script>
