<template>
	<article class="vue-component stac item">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="stac.id"></a>
			<h2>{{ title }}</h2>
		</slot>

		<slot name="before-description" v-bind="$props"></slot>

		<summary class="description" v-if="properties.description || properties.deprecated || stac['federation:missing']">
			<Description v-if="properties.description" :description="properties.description"></Description>

			<DeprecationNotice v-if="properties.deprecated" entity="item" />
			<FederationMissingNotice v-if="stac['federation:missing']" :missing="stac['federation:missing']" :federation="federation" />
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

			<slot v-if="stac.geometry || Array.isArray(stac.bbox)" name="location" :geometry="stac.geometry" :bbox="stac.bbox" :mapOptions="mapOptions">
				<div class="tabular wrap">
					<label>Location</label>
					<div class="value map" ref="mapContainer">
						<template v-if="!map">
							Latitudes: {{ stac.bbox[1] }} / {{ stac.bbox[3] }}, Longitudes: {{ stac.bbox[0] }} / {{ stac.bbox[2] }}
						</template>
					</div>
				</div>
			</slot>

			<StacFields type="Item" :metadata="stac" headingTag="h4" :ignore="ignoredFields" />
		</section>

		<section class="assets" v-if="hasAssets">
			<h3>Assets</h3>
			<ul class="list">
				<StacAsset v-for="(asset, id) in stac.assets" :key="id" :asset="asset" :id="id" :context="stac" />
			</ul>
		</section>

		<section class="links">
			<LinkList :links="stac.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'parent', 'root', 'license', 'cite-as']" />
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import FederationMixin from './internal/FederationMixin.js';
import StacMixin from './internal/StacMixin.js';
import Utils from '../utils';

export default {
	name: 'Item',
	mixins: [
		FederationMixin,
		StacMixin
	],
	// Mixins don't work properly in web components,
	// see https://github.com/vuejs/vue-web-component-wrapper/issues/30
	props: {
		...FederationMixin.props,
		...StacMixin.props
	},
	data() {
		return {
			ignoredFields: ['title', 'description', 'deprecated', 'federation:missing']
		};
	},
	computed: {
		properties() {
			if (Utils.isObject(this.stac.properties)) {
				return this.stac.properties;
			}
			return {};
		},
		title() {
			if (this.properties.title) {
				return `${this.properties.title} (${this.stac.id})`;
			}
			else {
				return this.stac.id;
			}
		},
		showMap() {
			return Boolean(this.stac.geometry);
		}
	},
	methods: {
		addFeatures() {
			let geom = this.map.leaflet.geoJSON(this.stac);
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
@use './base.scss';

.vue-component.stac {
	.metadata .map.value {
		overflow: hidden;
	}
}
</style>