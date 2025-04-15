<template>
	<article class="vue-component stac collection">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="stac.id"></a>
			<h2>{{ stac.id }}</h2>
		</slot>

		<summary v-if="stac.title">{{ stac.title }}</summary>

		<section class="keywords" v-if="hasElements(stac.keywords)">
			<ul class="badges">
				<li class="badge" v-for="keyword in stac.keywords" :key="keyword">{{ keyword }}</li>
			</ul>
		</section>

		<slot name="before-description" v-bind="$props"></slot>

		<section class="description" v-if="stac.description">
			<h3>Description</h3>

			<Description :description="stac.description"></Description>
			<DeprecationNotice v-if="stac.deprecated" entity="collection" />
			<FederationNotice v-if="supportedBy" :backends="supportedBy" :federation="federation" entity="collection" />
			<FederationMissingNotice v-if="affectedByMissing" :missing="missing" :federation="federation" />
		</section>

		<section class="license">
			<h3>License</h3>
			<span v-html="license" />
		</section>

		<!-- v-show to prevent issue with thumbnails and Leaflet map, see https://github.com/Open-EO/openeo-vue-components/issues/44 -->
		<section class="preview" v-show="thumbnails.length">
			<h3>Previews</h3>
			<div class="thumbnails">
				<a v-for="img in thumbnails" :key="img.href" :href="img.href" target="_blank">
					<img :src="img.href" :title="img.title" :alt="img.title || 'Preview'" />
				</a>
			</div>
		</section>

		<section class="extent" v-if="temporalIntervals.length || boundingBoxes.length">
			<div v-if="boundingBoxes.length">
				<h3>Spatial Extent</h3>
				<slot name="spatial-extents" :extents="boundingBoxes" :mapOptions="mapOptions" :worldwide="worldwide">
					<span v-if="worldwide" class="worldwide"><i class="fas fa-globe"></i> Worldwide</span>
					<div v-else class="map" ref="mapContainer">
						<template v-if="!map">
							<ul v-for="(bbox, i) in boundingBoxes" :key="i">
								<li>Latitudes: {{ bbox[1] }} / {{ bbox[3] }}, Longitudes: {{ bbox[0] }} / {{ bbox[2] }}</li>
							</ul>
						</template>
					</div>
				</slot>
			</div>

			<div v-if="temporalIntervals.length">
				<h3>Temporal Extent</h3>
				<slot name="temporal-extents" :extents="temporalIntervals.length > 0">
					<template v-if="temporalIntervals.length > 1">
						<ul v-for="(interval, i) in temporalIntervals" :key="i">
							<li v-if="i !== 0" v-html="formatters.formatTemporalExtent(interval)" />
						</ul>
					</template>
					<span v-else v-html="formatters.formatTemporalExtent(temporalIntervals[0])" />
				</slot>
			</div>
		</section>

		<section class="providers" v-if="hasProviders">
			<h3>Providers</h3>
			<ol>
				<li v-for="provider in stac.providers" :key="provider.name">
					<a v-if="provider.url" :href="provider.url" target="_blank">{{ provider.name }}</a>
					<template v-else>{{ provider.name }}</template>
					<template v-if="hasElements(provider.roles)">
						<ul class="badges small inline">
							<li v-for="role in provider.roles" :key="role" class="badge provider-role">{{ role }}</li>
						</ul>
					</template>
					<Description v-if="provider.description" :description="provider.description" :compact="true" />
				</li>
			</ol>
		</section>

		<section class="dimensions" v-if="hasDimensions">
			<h3>Data Cube Dimensions</h3>
			<ul>
				<li v-for="(dim, name) in stac['cube:dimensions']" :key="name" class="dimension">
					<h4>
						<a v-if="dim.type === 'bands'" @click="scrollToBands" class="name" href="#summary_bands">{{ name }}</a>
						<span v-else class="name">{{ name }}</span>
						<ul class="type badges small inline"><li class="badge">{{ dim.type }}</li></ul>
					</h4>
					<Description v-if="dim.description" :description="dim.description" />
					<div class="tabular" v-if="dim.axis">
						<label>Axis:</label>
						<div class="value">{{ dim.axis }}</div>
					</div>
					<div class="tabular">
						<label>Labels:</label>
						<div v-if="dim.extent" class="value">
							<span v-if="dim.type === 'temporal'" v-html="formatters.formatTemporalExtent(dim.extent)" />
							<span v-else v-html="formatters.formatExtent(dim.extent)" />
						</div>
						<ul v-else-if="Array.isArray(dim.values) && dim.values.length > 0" class="value comma-separated-list">
							<li v-for="value in dim.values" :key="value">{{ value }}</li>
						</ul>
						<div v-else class="value"><i>n/a</i></div>
					</div>
					<div class="tabular" v-if="(typeof dim.step !== 'undefined')">
						<label>Steps:</label>
						<div class="value">
							<template v-if="dim.step === null">irregularly spaced</template>
							<template v-else-if="dim.type === 'temporal'">{{ formatDuration(dim.step) }}</template>
							<template v-else>{{ dim.step }}</template>
						</div>
					</div>
					<div class="tabular" v-if="(typeof dim.reference_system !== 'undefined')">
						<label>Reference System:</label>
						<div class="value">
							<div class="epsg" v-if="(typeof dim.reference_system === 'number')" v-html="formatters.formatEPSG(dim.reference_system)" />
							<div class="wkt2" v-else-if="(typeof dim.reference_system === 'string')" v-html="formatters.formatWKT2(dim.reference_system)" />
							<ObjectTree class="projjson" v-else-if="(typeof dim.reference_system === 'object')" :data="dim.reference_system" />
							<template v-else>{{ dim.reference_system }}</template>
						</div>
					</div>
				</li>
			</ul>
		</section>

		<StacFields class="summaries" type="Collection" :metadata="stac" :ignore="ignoredFields" />

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
import Utils from '../utils';
import { Formatters } from '@radiantearth/stac-fields';
import FederationMixin from './internal/FederationMixin.js';
import StacMixin from './internal/StacMixin.js';
import { isoDuration, en } from '@musement/iso-duration';

export default {
	name: 'Collection',
	components: {
		ObjectTree: () => import('./ObjectTree.vue')
	},
	mixins: [
		StacMixin,
		FederationMixin
	],
	// Mixins don't work properly in web components,
	// see https://github.com/vuejs/vue-web-component-wrapper/issues/30
	props: {
		...StacMixin.props,
		...FederationMixin.props
	},
	data() {
		return {
			ignoredFields: ['federation:backends'],
			formatters: Formatters
		};
	},
	computed: {
		supportedBy() {
			if (Utils.isObject(this.stac.summaries) && Array.isArray(this.stac.summaries['federation:backends'])) {
				return this.stac.summaries['federation:backends'];
			}
			else if (Array.isArray(this.stac['federation:backends'])) {
				return this.stac['federation:backends'];
			}
			else {
				return undefined;
			}
		},
		missing() {
			if (Utils.isObject(this.stac.summaries) && Array.isArray(this.stac.summaries['federation:missing'])) {
				return this.stac.summaries['federation:missing'];
			}
			else if (Array.isArray(this.stac['federation:missing'])) {
				return this.stac['federation:missing'];
			}
			else {
				return undefined;
			}
		},
		affectedByMissing() {
			if (this.missing && !Array.isArray(this.supportedBy)) {   // in case missing is set but supportedBy is unexpectedly not an array...
				return true;   // default to display the notice (don't hold back information when we can't be sure)
			} else {   // otherwise: check if any of the missing backends is actually in the list of backends that are relevant here
				return Array.isArray(this.missing) && this.missing.some(backend => this.supportedBy.includes(backend));
			}
		},
		showMap() {
			return this.boundingBoxes.length > 0 && !this.worldwide;
		},
		temporalIntervals() {
			let e = this.stac.extent;
			if (Utils.isObject(e) && Utils.isObject(e.temporal) && Utils.size(e.temporal.interval) > 0) {
				return e.temporal.interval.filter(interval => Array.isArray(interval) && interval.length >= 2 && interval.filter(i => typeof i === 'string').length > 0);
			}
			return [];
		},
		boundingBoxes() {
			let e = this.stac.extent;
			if (Utils.isObject(e) && Utils.isObject(e.spatial) && Utils.size(e.spatial.bbox) > 0) {
				return e.spatial.bbox.filter(bbox => Array.isArray(bbox) && bbox.length >= 4);
			}
			return [];
		},
		worldwide() {
			if (this.boundingBoxes.length !== 1) {
				return false;
			}
			let bbox = this.boundingBoxes[0];
			return (Math.round(bbox[0]) == -180 && Math.round(bbox[1]) == -90 && Math.round(bbox[2]) == 180 && Math.round(bbox[3]) == 90);
		},
		hasProviders() {
			return Utils.size(this.stac.providers) > 0;
		},
		hasDimensions() {
			return Utils.size(this.stac['cube:dimensions']) > 0;
		},
		license() {
			if (typeof this.stac.license !== 'string' || this.stac.license.length === 0) {
				return false;
			}
			
			return Formatters.formatLicense(this.stac.license, null, null, this.stac);
		}
	},
	methods: {
		addFeatures() {
			try {
				L.Wrapped = require('leaflet.antimeridian');
			} catch (error) {
				console.warn(`Leaflet Antimeridian plugin is not available: ${error.message}`);
			}
			let features = L.featureGroup();
			let bboxes = this.boundingBoxes.length > 1 ? this.boundingBoxes.slice(1) : this.boundingBoxes;
			for(let bbox of bboxes) {
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
			return features;
		},
		scrollToBands(evt) {
			let elem = this.$el.querySelector('#field_bands');
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
		},
		formatDuration(duration) {
			if (typeof duration === 'string') {
				try {
					isoDuration.setLocales({en});
					return isoDuration(duration).humanize('en');
				} catch (error) {
					console.warn(error);
				}
			}
			
			return 'n/a';
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.collection {
	.keywords {
		margin-top: 1em;
	}
	.dimensions > ul .dimension {
		h4 {
			margin: 0;
			margin-bottom: 0.5em;
		}
		.type {
			font-weight: normal;
		}
	}

	@media screen and (min-width: 1000px) {
		.dimensions > ul {
			display: flex;
			margin: 0;
			padding: 0;

			.dimension {
				list-style-type: none;
				min-width: 23%;

				margin-left: 1%;
				border-left: 1px dotted #ccc;
				padding-left: 1%;

				&:first-of-type {
					margin-left: 0;
					border: 0;
					padding-left: 0;
				}
				.tabular {
					display: flex;
					flex-direction: column;

					label {
						margin-top: 0.5em;
					}
				}
			}
		}
		.extent {
			display: flex;

			> div {
				min-width: 49%;
				flex-grow: 1;
			}

			> div:nth-child(2) {
				margin-left: 1%;
				border-left: 1px dotted #ccc;
				padding-left: 1%;
			}
		}
	}

	.projjson,
	.wkt2,
	td > dl, td > ol, td > ul {
		margin: -3px;
		padding: 3px;
		height: 7em;
		overflow: auto;
    	resize: vertical;
	}
	.provider-role {
		text-transform: capitalize;
	}
}
</style>