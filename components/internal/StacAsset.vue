<template>
  <li class="vue-component asset">
    <h4>
      <ul class="badges actions">
        <li class="badge action download">
          <a class="badge-fill" :href="asset.href" target="_blank" download>
            Download '{{ asset.title || id }}'
            <template v-if="fileFormat">as {{ fileFormat }}</template>
          </a>
        </li>
      </ul>
      <ul v-if="Array.isArray(asset.roles)" class="badges">
        <li v-for="role in asset.roles" :key="role" class="badge" :class="role === 'data' ? 'green' : 'secondary'">{{ role }}</li>
      </ul>
    </h4>
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
  h4  {
    font-size: 1.1em;
    margin: 0;
    font-weight: normal;

    .download {
      margin-right: 1em;
    }
  }
  h5  {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0.75em 0 0.5em;
  }

  .metadata {
    font-size: 0.9em;
  }
}
</style>