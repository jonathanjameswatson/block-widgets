<template>
  <div>
    <blue-control
      v-for="(parameter, i) in parameters"
      :key="parameter.propertyKey"
      :label="parameter.name"
    >
      <template v-if="parameter.type === 'union'">
        <blue-select
          :options="getOptions(parameter)"
          :value="configuration[parameter.propertyKey]"
          @input="parameterHandlers[i]"
        />
      </template>
      <template v-else-if="parameter.type === 'string'">
        <blue-input
          :value="configuration[parameter.propertyKey]"
          :placeholder="parameter.placeholder"
          @input="parameterHandlers[i]"
        />
      </template>
      <template v-else-if="parameter.type === 'boolean'">
        <blue-select
          :options="[parameter.defaultBoolean, !parameter.defaultBoolean]"
          :option-names="getBooleanOptionNames(parameter)"
          :value="configuration[parameter.propertyKey]"
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
  UnionParameter,
  BooleanParameter,
} from '~/ts/configuration'
import { getConfiguration } from '~/ts/configurationControllers'

const configuration = getConfiguration()

const parameterNames = computed(() => getParameterNames(configuration.value))

const parameters = computed(() =>
  parameterNames.value.map((parameterName) =>
    getParameter(configuration.value, parameterName)
  )
)

const updateValue = (propertyKey: keyof Configuration, value: any) => {
  configuration.value[propertyKey] = value as never
}

const getOptions = <T extends Configuration>(parameter: UnionParameter<T>) => {
  return parameter.options
}

const getBooleanOptionNames = <T extends Configuration>(
  parameter: BooleanParameter<T>
) =>
  (parameter.defaultBoolean
    ? (x: string[]) => x
    : (x: string[]) => x.reverse())([parameter.trueLabel, parameter.falseLabel])

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
}

const parameterHandlers = computed(() =>
  parameters.value.map((parameter) =>
    inputMethods[parameter.type](parameter.propertyKey)
  )
)
</script>
