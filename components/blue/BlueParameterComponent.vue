<template>
  <component
    :is="parameterComponent"
    v-bind="parameter.props"
    :model-value="getValue"
    :disabled="parameter.disabled"
    @update:model-value="updateValue"
  />
</template>

<script setup lang="ts">
import { Configuration } from '~/ts/configurations/configuration'
import { Parameter } from '~/ts/parameters/parameter'

import type { ConcreteComponent } from 'vue'

interface Props {
  parameter: Parameter
  parameterKey: string
}

const props = defineProps<Props>()

const configuration = useConfiguration()

const getValue = computed(() => {
  return configuration.value[props.parameterKey as keyof Configuration]
})

const updateValue = (value: any) => {
  configuration.value[props.parameterKey as keyof Configuration] =
    props.parameter.convertInput(value) as never
}

const parameterComponent = shallowRef<string | ConcreteComponent | undefined>()
watchEffect(() => {
  parameterComponent.value = props.parameter.componentName // resolveComponent(props.parameter.componentName)
})
</script>
