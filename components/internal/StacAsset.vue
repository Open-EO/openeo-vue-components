<template>
  <li class="vue-component asset">
    <h4>
      <span>{{ asset.title || id }}</span>
      <ul v-if="Array.isArray(asset.roles)" class="badges roles">
        <li v-for="role in asset.roles" :key="role" class="badge" :class="role === 'data' ? 'green' : 'secondary'">{{ role }}</li>
      </ul>
    </h4>
    <ul class="badges actions primary">
      <li class="badge action download">
        <a class="badge-fill" :href="asset.href" target="_blank" download>
          <span class="icon">💾</span> Download <template v-if="fileFormat">{{ fileFormat }}</template>
        </a>
      </li>
      <li class="badge action copy" @click.prevent.stop="copyURL($event, asset.href)">
        <span class="icon">📋</span> Copy URL
      </li>
      <template v-for="action in actions">
        <li v-if="!action.show || action.show(asset)" :key="action.label" class="badge action" @click.prevent.stop="action.click($event, asset)">
          <span class="icon" v-if="action.icon">{{ action.icon }}</span> {{ action.label }}
        </li>
      </template>
    </ul>
    <Description v-if="asset.description" :description="asset.description" :compact="true" />
    <StacFields type="Asset" :metadata="asset" :ignore="ignore" title="" :context="context" headingTag="h5" />
  </li>
</template>

<script>
import { Formatters } from '@radiantearth/stac-fields';
import Description from '../Description.vue';
import StacFields from './StacFields.vue';
import CopyMixin from './CopyMixin';

export default {
  name: 'Asset',
  components: {
    Description,
    StacFields
  },
  mixins: [CopyMixin],
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
    },
    actions: {
      // Array of objects with the following properties:
      // - label (string)
      // - icon (optional, string)
      // - show (optional, function(asset) -> boolean)
      // - click (function(event, asset) -> void)
      type: Array,
      default: () => []
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
  },
  methods: {
		copyURL(event, url) {
      const elem = event.composedPath()[0].querySelector('.icon'); // event.target doesn't work in web components
      this.copyText(url, () => this.toggleIcon(elem, '✅'), () => this.toggleIcon(elem, '❌'));
		}
  }
}
</script>

<style lang="scss">
.vue-component.asset {
  margin-bottom: 1.5em !important;

  > * {
    margin: 0.25em 0;
  }

  .actions > .action {
    padding: 0.5em;
  }

  h4  {
    font-size: 1.1em;

    > .roles {
      font-size: 0.95em;
      margin-left: 0.3em;
    }
  }

  h5  {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0.5em 0;
  }

  .metadata {
    font-size: 0.9em;
  }
}
</style>