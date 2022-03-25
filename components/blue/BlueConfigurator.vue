<template>
  <BlueControl
    v-for="(parameter, i) in parameters"
    :key="parameter.propertyKey"
    :label="parameter.name"
  >
    <component
      :is="parameter.component"
      v-bind="parameter.props"
      :model-value="getValue(parameter)"
      :disabled="parameter.disabled"
      @update:model-value="parameterHandlers[i]"
    />
  </BlueControl>
</template>

<script setup lang="ts">
import {
  Configuration,
  getParameterNames,
  getParameter,
} from '~/ts/vueDependent/configurations/configuration'
import { Parameter } from '~/ts/vueDependent/parameters/parameter'

const configuration = useConfiguration()

const parameterNames = computed(() => getParameterNames(configuration.value))
const parameters = computed(() =>
  parameterNames.value.map((parameterName) =>
    getParameter(configuration.value, parameterName)
  )
)

const getValue = (parameter: Parameter) => {
  return configuration.value[parameter.propertyKey as keyof Configuration]
}

const updateValue = (propertyKey: keyof Configuration, value: any) => {
  configuration.value[propertyKey] = value as never
}

const parameterHandlers = computed(() =>
  parameters.value.map(
    (parameter) => (input: any) =>
      updateValue(
        parameter.propertyKey as keyof Configuration,
        parameter.convertInput(input)
      )
  )
)
</script>
