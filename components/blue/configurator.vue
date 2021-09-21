<template>
  <div>
    <blue-control
      v-for="(parameter, i) in parameters"
      :key="parameter.propertyKey"
      :label="parameter.name"
    >
      <component
        :is="parameter.component"
        v-bind="parameter.props"
        :value="getValue(parameter)"
        :disabled="parameter.disabled"
        @input="parameterHandlers[i]"
      />
    </blue-control>
  </div>
</template>

<script setup lang="ts">
import useConfiguration from '~/composables/useConfiguration'

import Configuration, {
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
