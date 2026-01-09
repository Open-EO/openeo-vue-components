<template>
  <div class="stac-component">
    <Loading v-if="isLoading" />
    <Error v-else-if="error" :message="error" />
    <Item v-else-if="isItem" :data="stac" :url="url">
      <template #before-description>
        <p>
          <template v-if="rootLink">
            [<a :href="rootLink.href" @click.prevent="onStacNavigation(rootLink)">Go to Root</a>]
          </template>
          <template v-if="collectionLink">
            [<a :href="collectionLink.href" @click.prevent="onStacNavigation(collectionLink)">Go to Collection</a>]
          </template>
          <template v-if="parentLink">
            [<a :href="parentLink.href" @click.prevent="onStacNavigation(parentLink)">Go to Parent</a>]
          </template>
        </p>
      </template>
      <template #end>
        <h3>Source</h3>
        <p>
          <a :href="stacUrl" target="_blank"><code>{{ stacUrl }}</code></a>
        </p>
      </template>
    </Item>
    <Collection v-else-if="isCollectionLike" :data="stac" :url="url" :onStacNavigation="onStacNavigation">
      <template #before-description>
        <p>
          <template v-if="rootLink">
            [<a :href="rootLink.href" @click.prevent="onStacNavigation(rootLink)">Go to Root</a>]
          </template>
          <template v-if="parentLink">
            [<a :href="parentLink.href" @click.prevent="onStacNavigation(parentLink)">Go to Parent</a>]
          </template>
        </p>
      </template>
      <template #end>
        <h3>Source</h3>
        <p>
          <a :href="stacUrl" target="_blank"><code>{{ stacUrl }}</code></a>
        </p>
      </template>
    </Collection>
    <ObjectTree v-else :data="stac" />
  </div>
</template>

<script>
import Loading from './internal/Loading.vue';
import Error from './internal/Error.vue';
import MapMixin from './internal/MapMixin.js';
import ObjectTree from './ObjectTree.vue';
import Utils from '../utils';
import StacLinksMixin from './internal/StacLinksMixin.js';

export default {
  name: 'Stac',
  mixins: [
    MapMixin,
    StacLinksMixin
  ],
  components: {
    Error,
    Loading,
		Item: () => import('./Item.vue'),
    Collection: () => import('./Collection.vue')
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    ...MapMixin.props
  },
  data() {
    return {
      isLoading: false,
      error: null,
      stac: null,
      stacUrl: null,
    }
  },
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
  created() {
    if (this.data) {
      this.stac = this.data;
      this.stacUrl = this.url;
    } else if (this.url) {
      this.load(this.url);
    }
  },
  computed: {
    isItem() {
      return this.stac && this.stac.type === 'Feature';
    },
    isCollectionLike() {
      return this.stac && (this.stac.type === 'Collection' || this.stac.type === 'Catalog');
    },
    rootLink() {
      const link = this.makeLinkAbsolute(this.getStacLinkByRel(this.stac.links, 'root'));
      return (link && link.href === this.stacUrl) ? null : link;
    },
    parentLink() {
      const link = this.makeLinkAbsolute(this.getStacLinkByRel(this.stac.links, 'parent'));
      return (link && link.href === this.stacUrl) ? null : link;
    },
    collectionLink() {
      const link = this.makeLinkAbsolute(this.getStacLinkByRel(this.stac.links, 'collection'));
      return (link && link.href === this.stacUrl) ? null : link;
    }
  },
  methods: {
    onStacNavigation(link) {
      if (link && link.href) {
        this.load(link.href);
      }
      else {
        this.error = 'The selected STAC link is invalid.';
      }
    },
    makeLinkAbsolute(link) {
      if (!link || !link.href) {
        return link;
      }
      return Object.assign({}, link, {
        href: (new URL(link.href, this.stacUrl)).href
      });
    },
    async load(url) {
      if (this.stacUrl === url) {
        return;
      }
      this.error = null;
      this.isLoading = true;
      this.stacUrl = url;
      try {
        const response = await fetch(url);
        this.stac = await response.json();
      } catch (error) {
        this.error = `Failed to load STAC from ${url}: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style lang="scss">
@use './base.scss';
</style>