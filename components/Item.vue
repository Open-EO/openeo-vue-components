<template>
	<article class="vue-component stac item">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="data.id"></a>
			<h2>{{ title }}</h2>
		</slot>

		<slot name="before-description" v-bind="$props"></slot>

		<summary class="description" v-if="properties.description">
			<Description :description="properties.description"></Description>

			<DeprecationNotice v-if="properties.deprecated" entity="item" />
		</summary>

		<section class="preview" v-if="thumbnails.length">
			<h3>Previews</h3>
			<div class="thumbnails">
				<a v-for="img in thumbnails" :key="img.href" :href="img.href" target="_blank">
					<img :src="img.href" :title="img.title" :alt="img.title || 'Preview'" />
				</a>
			</div>
		</section>

		<section class="metadata properties">
			<h3 v-if="thumbnails.length">Metadata</h3>

			<slot v-if="data.geometry || Array.isArray(data.bbox)" name="location" :geometry="data.geometry" :bbox="data.bbox" :mapOptions="mapOptions">
				<div class="tabular wrap">
					<label>Location</label>
					<div class="value map" ref="mapContainer">
						<template v-if="!map">
							Latitudes: {{ data.bbox[1] }} / {{ data.bbox[3] }}, Longitudes: {{ data.bbox[0] }} / {{ data.bbox[2] }}
						</template>
					</div>
				</div>
			</slot>

			<StacFields :metadata="data" headingTag="h4" :ignore="ignoredFields" />
		</section>

		<section class="assets">
			<LinkList :links="assetLinks" heading="Assets" headingTag="h3" />
		</section>

		<section class="links">
			<LinkList :links="data.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'parent', 'root', 'license', 'cite-as']" />
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import StacMixin from './internal/StacMixin.js';
import Utils from '../utils';

export default {
	name: 'Item',
	mixins: [StacMixin],
	// Mixins don't work properly in web components,
	// see https://github.com/vuejs/vue-web-component-wrapper/issues/30
	props: {...StacMixin.props},
	data() {
		return {
			ignoredFields: ['title', 'description', 'deprecated']
		};
	},
	computed: {
		properties() {
			if (Utils.isObject(this.data.properties)) {
				return this.data.properties;
			}
			return {};
		},
		title() {
			if (this.properties.title) {
				return `${this.properties.title} (${this.data.id})`;
			}
			else {
				return this.data.id;
			}
		},
		showMap() {
			return Boolean(this.data.geometry);
		}
	},
	methods: {
		addFeatures() {
			let geom = this.map.leaflet.geoJSON(this.data);
			geom.setStyle({
				color: '#3388ff',
				fillOpacity: 0.2
			});
			return geom;
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.stac {
	.metadata .map.value {
		overflow: hidden;
	}
}
</style>