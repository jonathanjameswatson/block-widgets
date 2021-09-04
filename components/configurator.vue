<template>
  <div>
    <blue-control
      v-for="property in properties"
      :key="property.propertyKey"
      :label="property.name"
    >
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
      <template v-else-if="property.parameter.type === 'boolean'">
        <blue-select
          :options="[false, true]"
          :option-names="['Off', 'On']"
          :value="mutableConfiguration[property.propertyKey]"
          @input="(event) => updateValue(property.propertyKey, event)"
        />
      </template>
    </blue-control>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  toRefs,
} from '@nuxtjs/composition-api'

import Configuration, {
  getEditableProperties,
  getPropertyMetadata,
} from '~/ts/configuration'

export default defineComponent({
  props: {
    configuration: {
      type: Object as <T extends Configuration>() => T,
      required: true,
    },
  },
  setup(props) {
    const { configuration } = toRefs(props)

    const mutableConfiguration = ref(configuration)

    watch(configuration, () => {
      mutableConfiguration.value = configuration.value
    })

    const propertyNames = computed(() =>
      getEditableProperties(configuration.value)
    )

    const properties = computed(() =>
      propertyNames.value.map((propertyName) =>
        getPropertyMetadata(mutableConfiguration.value, propertyName)
      )
    )

    const updateValue = (propertyKey: string, propertyValue: string) => {
      // @ts-ignore
      mutableConfiguration.value[propertyKey] = propertyValue
    }

    return { mutableConfiguration, propertyNames, properties, updateValue }
  },
})
</script>
