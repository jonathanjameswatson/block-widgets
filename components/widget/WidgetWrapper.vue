<template>
  <div :class="classes">
    <slot></slot>
    <div ref="customCssContainer" />
  </div>
</template>

<script setup lang="ts">
import { CssNode } from 'css-tree'

const props = defineProps<{
  modifyCss?: string
}>()

const configuration = useConfiguration()

const customCssContainer = ref<HTMLDivElement | undefined>()

const setStyle = async (css: string) => {
  if (customCssContainer.value === undefined) {
    return
  }

  let newCss = css

  const { modifyCss } = props

  if (modifyCss !== undefined && css !== '') {
    const { parse, walk, generate, fromPlainObject } = await import('css-tree')
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
  async (css: string) => await setStyle(css)
)

onMounted(async () => await setStyle(configuration.value.css))

const classes = computed(() => {
  const fontFamily = `font-${configuration.value.style.toLowerCase()}`
  const fontSize = `text-notion-${
    configuration.value.textSize ? 'small' : 'normal'
  }`

  const classes = [fontFamily, fontSize]

  if (configuration.value.padding) {
    classes.push('p-4', 'pt-0')
  }

  return classes
})
</script>
