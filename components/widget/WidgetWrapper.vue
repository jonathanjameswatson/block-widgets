<template>
  <div :class="classes">
    <slot />
    <Style
      v-if="customStyle !== undefined"
      type="text/css"
      :children="customStyle"
    />
  </div>
</template>

<script setup lang="ts">
import type { CssNode } from 'css-tree'

const props = defineProps<{
  modifyCss?: string
}>()

const configuration = useConfiguration()

const customStyle = ref<string>()

const setStyle = async (css: string) => {
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

  customStyle.value = newCss
}

watch(
  () => configuration.value.css,
  async (css: string) => await setStyle(css)
)

await setStyle(configuration.value.css)

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
