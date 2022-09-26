<template>
  <div>
    <BlueControl
      v-for="(parameter, parameterKey) in parameters"
      :key="parameterKey"
      :label="parameter.name"
    >
      <BlueParameterComponent
        :parameter="parameter"
        :parameter-key="parameterKey"
      />
    </BlueControl>
  </div>
</template>

<script setup lang="ts">
import BlueParameterComponent from './BlueParameterComponent.vue'
import { configurationProperties } from '~/ts/configurations/configuration'

const configuration = useConfiguration()

const parameters = computed(
  () =>
    configurationProperties[configuration.value.configurationName].parameters
)
</script>
