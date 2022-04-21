<template>
  <div>
    <BlueControl
      v-for="(parameter, parameterKey) in parameters"
      :key="parameterKey"
      :label="parameter.name"
    >
      <BlueParameterComponent
        :parameter="parameter"
        :parameterKey="parameterKey"
      />
    </BlueControl>
  </div>
</template>

<script setup lang="ts">
import { configurationProperties } from '~/ts/configurations/configuration'
import BlueParameterComponent from './BlueParameterComponent.vue'

const configuration = useConfiguration()

const parameters = computed(
  () =>
    configurationProperties[configuration.value.configurationName].parameters
)
</script>
