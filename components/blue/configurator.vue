<template>
  <div>
    <blue-control
      v-for="(parameter, i) in parameters"
      :key="parameter.propertyKey"
      :label="parameter.name"
    >
      <template v-if="parameter.type === 'union'">
        <blue-select
          :options="parameter.options"
          :value="getValue(parameter)"
          :min-width="parameter.minWidth"
          :disabled="parameter.disabled"
          @input="parameterHandlers[i]"
        />
      </template>
      <template v-else-if="parameter.type === 'string'">
        <blue-input
          :value="getValue(parameter)"
          :placeholder="parameter.placeholder"
          :disabled="parameter.disabled"
          @input="parameterHandlers[i]"
        />
      </template>
      <template v-else-if="parameter.type === 'boolean'">
        <blue-select
          :options="[parameter.defaultBoolean, !parameter.defaultBoolean]"
          :option-names="getBooleanOptionNames(parameter)"
          :value="getValue(parameter)"
          :min-width="parameter.minWidth"
          :disabled="parameter.disabled"
          @input="parameterHandlers[i]"
        />
      </template>
      <template v-else-if="parameter.type === 'number'">
        <blue-number-input
          :minimum="parameter.minimum"
          :maximum="parameter.maximum"
          :step="parameter.step"
          :value="getValue(parameter)"
          :disabled="parameter.disabled"
          @input="parameterHandlers[i]"
        />
      </template>
    </blue-control>
  </div>
</template>

<script setup lang="ts">
import Configuration, {
  getParameterNames,
  getParameter,
} from '~/ts/configuration'
import { Parameter, BooleanParameter } from '~/ts/parameters'
import useConfiguration from '~/composables/useConfiguration'

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

const getBooleanOptionNames = (parameter: BooleanParameter) =>
  (parameter.defaultBoolean
    ? (x: string[]) => x
    : (x: string[]) => x.reverse())([parameter.trueLabel, parameter.falseLabel])

const updateValue = (propertyKey: keyof Configuration, value: any) => {
  configuration.value[propertyKey] = value as never
}

const inputMethods = {
  union(propertyKey: keyof Configuration) {
    return (selection: any) => updateValue(propertyKey, selection)
  },
  string(propertyKey: keyof Configuration) {
    return (event: Event) =>
      updateValue(
        propertyKey,
        (event.target as unknown as { value: string }).value
      )
  },
  boolean(propertyKey: keyof Configuration) {
    return (value: object) => updateValue(propertyKey, value)
  },
  number(propertyKey: keyof Configuration) {
    return (number: number) => updateValue(propertyKey, number)
  },
}

const parameterHandlers = computed(() =>
  parameters.value.map((parameter) =>
    inputMethods[parameter.type](parameter.propertyKey as keyof Configuration)
  )
)
</script>
