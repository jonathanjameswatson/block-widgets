<template>
  <div>
    <div v-for="property in properties" :key="property.propertyKey">
      <p class="text-blue-700 font-bold mr-2 mb-2">{{ property.name }}</p>
      <p class="mb-4">
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
            :placeholder="property.parameter.placeholder"
            @input="
              (event) => updateValue(property.propertyKey, event.target.value)
            "
          />
        </template>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from '@nuxtjs/composition-api'

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
      getEditableProperties(props.configuration)
    )
    const properties = computed(() => {
      return propertyNames.value.map((propertyName) =>
        getPropertyMetadata(props.configuration, propertyName)
      )
    })

    const updateValue = (propertyKey: string, propertyValue: string) => {
      // @ts-ignore
      mutableConfiguration.value[propertyKey] = propertyValue
    }

    watch(props.configuration, () => {
      console.log('yee')
      mutableConfiguration.value = props.configuration
    })

    return { mutableConfiguration, propertyNames, properties, updateValue }
  },
})
</script>
