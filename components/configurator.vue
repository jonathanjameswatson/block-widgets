<template>
  <div>
    <p v-for="property in properties" :key="property.propertyKey">
      {{ property.name }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import Configuration, {
  getEditableProperties,
  getPropertyMetadata,
} from '~/ts/configuration'

export default defineComponent({
  props: {
    configuration: {
      type: Configuration,
      required: true,
    },
  },
  setup(props) {
    const { configuration } = props
    const propertyNames = getEditableProperties(configuration)
    const properties = propertyNames.map((propertyName) =>
      getPropertyMetadata(configuration, propertyName)
    )
    return { properties }
  },
})
</script>
