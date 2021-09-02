<template>
  <div>
    <p v-for="property in properties" :key="property.propertyKey">
      <span class="text-blue-800 font-bold mr-2">{{ property.name }}:</span>
      <template v-if="property.parameter.type === 'union'">
        <blue-select
          :options="property.parameter.options"
          :value="mutableConfiguration[property.propertyKey]"
          @input="(event) => updateValue(property.propertyKey, event)"
        />
      </template>
      <template v-else-if="property.parameter.type === 'string'">
        <blue-input
          :value="mutableConfiguration[property.propertyKey]"
          @input="
            (event) => updateValue(property.propertyKey, event.target.value)
          "
        />
      </template>

      <br /><br />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'

import Configuration, {
  getEditableProperties,
  getPropertyMetadata,
} from '~/ts/configuration'

export default defineComponent({
  props: {
    configuration: {
      type: Object as () => Configuration,
      required: true,
    },
  },
  setup(props) {
    const mutableConfiguration = ref(props.configuration)
    const propertyNames = computed(() =>
      getEditableProperties(mutableConfiguration.value)
    )
    const properties = computed(() => {
      return propertyNames.value.map((propertyName) =>
        getPropertyMetadata(mutableConfiguration.value, propertyName)
      )
    })

    const updateValue = (propertyKey: string, propertyValue: string) => {
      console.log(propertyValue)
      // @ts-ignore
      mutableConfiguration.value[propertyKey] = propertyValue
    }

    return { mutableConfiguration, propertyNames, properties, updateValue }
  },
})
</script>
