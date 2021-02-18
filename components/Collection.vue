<template>
	<article class="vue-component stac collection">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="data.id"></a>
			<h2>{{ data.id }}</h2>
		</slot>

		<summary v-if="data.title">{{ data.title }}</summary>

		<slot name="before-description" v-bind="$props"></slot>

		<section class="description" v-if="data.description">
			<h3>Description</h3>

			<Description :description="data.description"></Description>

			<DeprecationNotice v-if="data.deprecated" entity="collection" />

			<div v-if="hasElements(data.keywords)">
				<strong>Keywords:</strong>&nbsp;
				<ul class="comma-separated-list">
					<li v-for="(keyword, i) in data.keywords" :key="i">{{ keyword }}</li>
				</ul>
			</div>
		</section>

		<section class="license">
			<h3>License</h3>
			<span v-html="license" />
		</section>

		<section class="preview" v-if="thumbnails.length">
			<h3>Previews</h3>
			<div class="thumbnails">
				<a v-for="(img, i) in thumbnails" :key="i" :href="img.href" target="_blank">
					<img :src="img.href" :title="img.title" :alt="img.title || 'Preview'" />
				</a>
			</div>
		</section>

		<section class="extent" v-if="temporalIntervals.length || boundingBoxes.length">
			<template v-if="temporalIntervals.length">
				<h3>Temporal Extent</h3>
				<slot name="temporal-extents" :extents="temporalIntervals">
					<ul v-for="(interval, i) in temporalIntervals" :key="i">
						<li>{{ stac.formatTemporalExtent(interval) }}</li>
					</ul>
				</slot>
			</template>
		
			<template v-if="boundingBoxes.length">
			<h3>Spatial Extent</h3>
				<slot name="spatial-extents" :extents="boundingBoxes" :mapOptions="mapOptions">
					<div class="map" ref="mapContainer">
						<template v-if="!map">
							<ul v-for="(bbox, i) in boundingBoxes" :key="i">
								<li>Latitudes: {{ bbox[1] }} / {{ bbox[3] }}, Longitudes: {{ bbox[0] }} / {{ bbox[2] }}</li>
							</ul>
						</template>
					</div>
				</slot>
			</template>
		</section>

		<section class="providers" v-if="data.providers">
			<h3>Providers</h3>
			<ol>
				<li v-for="(provider, key) in data.providers" :key="key">
					<a v-if="provider.url" :href="provider.url" target="_blank">{{ provider.name }}</a>
					<template v-else>{{ provider.name }}</template>
					<template v-if="hasElements(provider.roles)">
						(<ul class="comma-separated-list">
							<li v-for="(role, r) in provider.roles" :key="r" class="provider-role">{{ role }}</li>
						</ul>)
					</template>
					<Description v-if="provider.description" :description="provider.description" :compact="true" />
				</li>
			</ol>
		</section>

		<section class="dimensions" v-if="hasDimensions">
			<h3>Data Cube Dimensions</h3>
			<ul>
				<li v-for="(dim, name) in data['cube:dimensions']" :key="name" class="dimension">
					<h4>
						<a v-if="dim.type === 'bands'" @click="scrollToBands" class="name" href="#summary_eo:bands">{{ name }}</a>
						<span v-else class="name">{{ name }}</span>
						<ul class="type badges small"><li class="badge">{{ dim.type }}</li></ul>
					</h4>
					<Description v-if="dim.description" :description="dim.description" />
					<div class="tabular" v-if="dim.axis">
						<label>Axis:</label>
						<div class="value">{{ dim.axis }}</div>
					</div>
					<div class="tabular">
						<label>Labels:</label>
						<div v-if="dim.extent" class="value">
							<template v-if="dim.type === 'temporal'">{{ stac.formatTemporalExtent(dim.extent) }}</template>
							<template v-else>{{ stac.formatExtent(dim.extent) }}</template>
						</div>
						<ul v-else-if="Array.isArray(dim.values) && dim.values.length > 0" class="value">
							<li v-for="(value, i) in dim.values" :key="i">{{ value }}</li>
						</ul>
						<div v-else class="value"><i>n/a</i></div>
					</div>
					<div class="tabular" v-if="typeof dim.step !== 'undefined'">
						<label>Steps:</label>
						<div class="value">
							<template v-if="dim.step === null">irregularly spaced</template>
							<template v-else>{{ dim.step }}</template>
						</div>
					</div>
					<div class="tabular" v-if="typeof dim.reference_system !== 'undefined'">
						<label>Reference System:</label>
						<div class="value">
							<template v-if="typeof dim.reference_system === 'number'">EPSG {{ dim.reference_system }}</template>
							<template v-else>{{ dim.reference_system }}</template>
						</div>
					</div>
				</li>
			</ul>
		</section>

		<StacFields class="summaries" :metadata="data" />

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
import Utils from '../utils';
import { Formatters } from '@radiantearth/stac-fields';
import StacMixin from './internal/StacMixin.js';

export default {
	name: 'Collection',
	mixins: [StacMixin],
	data() {
		return {
			stac: Formatters
		};
	},
	computed: {
		showMap() {
			return this.boundingBoxes.length !== 0;
		},
		temporalIntervals() {
			let e = this.data.extent;
			if (Utils.isObject(e) && Utils.isObject(e.temporal) && Utils.size(e.temporal.interval) > 0) {
				return e.temporal.interval.filter(interval => Array.isArray(interval) && interval.length >= 2);
			}
			return [];
		},
		boundingBoxes() {
			let e = this.data.extent;
			if (Utils.isObject(e) && Utils.isObject(e.spatial) && Utils.size(e.spatial.bbox) > 0) {
				return e.spatial.bbox.filter(bbox => Array.isArray(bbox) && bbox.length >= 4);
			}
			return [];
		},
		hasDimensions() {
			return Utils.size(this.data['cube:dimensions']) > 0;
		},
		license() {
			if (typeof this.data.license !== 'string' || this.data.license.length === 0) {
				return false;
			}
			
			return Formatters.formatLicense(this.data.license, null, null, this.data);
		}
	},
	methods: {
		addFeatures(features) {
			try {
				L.Wrapped = require('leaflet.antimeridian');
			} catch (e) {
				console.warn("Leaflet Antimeridian plugin is not available");
			}
			for(let bbox of this.boundingBoxes) {
				let p = [[bbox[1], bbox[0]], [bbox[3], bbox[0]], [bbox[3], bbox[2]], [bbox[1], bbox[2]]];
				let geom;
				if (L.Wrapped && bbox[2] < bbox[0]) {
					geom = new L.Wrapped.Polygon(p);
				}
				else {
					geom = L.polygon(p);
				}
				geom.setStyle({
					color: '#3388ff',
					fillOpacity: 0.2
				});
				features.addLayer(geom);
			}
		},
		scrollToBands() {
			let elem = this.$el.querySelector('#field_eo\\:bands');
			if (elem) {
				elem.scrollIntoView();
				elem.classList.add('highlight-box');
				setTimeout(() => {
					elem.classList.remove('highlight-box');
				}, 5000);
			}
			evt.preventDefault();
		},
		hasElements(data) {
			return (typeof data === 'object' && data !== null && Object.keys(data).length > 0);
		}
	}
}
</script>

<style>
@import url('./base.css');

.vue-component.collection .dimension h4 {
	margin: 0;
}
.vue-component.collection .dimension .type {
	font-weight: normal;
	font-size: 90%;
	margin-left: 0.5em;
}
.vue-component.collection .dimension label {
	font-weight: normal;
}
.vue-component.collection .provider-role {
	text-transform: capitalize;
}
</style>