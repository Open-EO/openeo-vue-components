<template>
  <li class="vue-component asset">
    <h4>
      {{ asset.title || id }}
      <ul v-if="Array.isArray(asset.roles)" class="badges small inline">
        <li v-for="role in asset.roles" :key="role" class="badge" :class="role === 'data' ? 'primary' : 'secondary'">{{ role }}</li>
      </ul>
    </h4>
    <p class="download"><a :href="asset.href" target="_blank">Download {{ fileFormat }}</a></p>
    <Description v-if="asset.description" :description="asset.description" :compact="true" />
    <StacFields type="Asset" :metadata="asset" :ignore="ignore" title="" :context="context" headingTag="h5" />
  </li>
</template>

<script>
import { Formatters } from '@radiantearth/stac-fields';
import Description from '../Description.vue';
import StacFields from './StacFields.vue';

export default {
  name: 'Asset',
  components: {
    Description,
    StacFields
  },
  props: {
    asset: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    context: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ignore: ['href', 'title', 'description', 'type', 'roles']
    };
  },
  computed: {
    fileFormat() {
      if (this.asset.type) {
        return Formatters.formatMediaType(this.asset.type);
      }
      return null;
    }
  }
}
</script>

<style lang="scss">
.vue-component.asset {
  h4, h5  {
    font-size: 1em;
  }
}
</style>