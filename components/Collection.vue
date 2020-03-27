<template>
	<article class="vue-component collection"><div :class="{collapsible: initiallyCollapsed, expanded: !collapsed}">

		<a class="anchor" :name="collection.id"></a>
		<h2 @click="toggle()">
			<span class="toggle">▸</span>{{ collection.id }}
		</h2>

		<slot name="collection-before-summary"></slot>

		<summary v-if="collection.title">{{collection.title}}</summary>

		<slot name="collection-after-summary"></slot>

		<div v-if="!collapsed">

			<slot name="collection-before-details"></slot>

			<section class="description" v-if="collection.description">
				<h3>Description</h3>

				<Description :description="collection.description"></Description>

				<DeprecationNotice v-if="collection.deprecated" entity="collection" />

				<div v-if="hasElements(collection.keywords)">
					<strong>Keywords:</strong>&nbsp;
					<ul class="comma-separated-list">
						<li v-for="(keyword, i) in collection.keywords" :key="i">{{ keyword }}</li>
					</ul>
				</div>
			</section>

			<section class="license">
				<h3>License</h3>
				<a class="value" v-if="licenseUrl" :href="licenseUrl" target="_blank">{{ collection.license }}</a>
				<span class="value" v-else>{{ collection.license }}</span>
			</section>

			<section class="extent" v-if="temporalInterval || boundingBox">
				<template v-if="temporalInterval">
					<h3>Temporal Extent</h3>
					<slot name="collection-temporal-extent" :extent="temporalInterval">
						<p>{{ stac.formatTemporalExtent(temporalInterval) }}</p>
					</slot>
				</template>
			
				<template v-if="boundingBox">
				<h3>Spatial Extent</h3>
					<slot name="collection-spatial-extent" :extent="boundingBox">
						<div :id="'map-' + collection.id" ref="mapContainer">
							<ul v-if="!map">
								<li>North: {{boundingBox[3]}}</li>
								<li>South: {{boundingBox[1]}}</li>
								<li>East: {{boundingBox[2]}}</li>
								<li>West: {{boundingBox[0]}}</li>
							</ul>
						</div>
					</slot>
				</template>
			</section>

			<section class="providers" v-if="collection.providers">
				<h3>Providers</h3>
                <ol>
					<li v-for="(provider, key) in collection.providers" :key="key">
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

			<section class="providers" v-if="hasDimensions">
				<h3>Data Cube Dimensions</h3>
				<ul>
					<li v-for="(dim, name) in collection['cube:dimensions']" :key="name" class="dimension">
						<h4>
							<a v-if="dim.type === 'bands'" @click="scrollToBands()" class="name">{{ name }}</a>
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
								{{ stac.formatValue(dim.extent, "extent", 'cube:dimensions') }}
							</div>
							<ul v-else-if="Array.isArray(dim.values) && dim.values.length > 0" class="value">
								<li v-for="(value, i) in dim.values" :key="i">{{ value }}</li>
							</ul>
							<div v-else class="value">N/A</div>
						</div>
						<div class="tabular" v-if="typeof dim.step !== 'undefined'">
							<label>Steps:</label>
							<div class="value">
								<template v-if="dim.step === null">irregularly spaced</template>
								<template v-else>{{ dim.step }}</template>
							</div>
						</div>
						<div class="tabular" v-if="typeof dim.reference_system !== 'undefined'">
							<label :key="i">Reference System:</label>
							<div class="value">
								<template v-if="typeof dim.reference_system === 'number'">EPSG {{ dim.reference_system }}</template>
								<template v-else>{{ dim.reference_system }}</template>
							</div>
						</div>
					</li>
				</ul>
			</section>

			<section class="summaries" v-if="hasSummaries">
				<h3>Additional information</h3>
				<div v-for="(value, field) in collection.summaries" :key="'summary_' + field" :ref="'summary_' + field" class="tabular" :class="{wrap: stac.isTable(value) && value.isWide}">
					<label>{{ stac.formatKey(field) }}:</label>
					<div class="value">
						<CollectionSummary :value="value" :field="field" />
					</div>
				</div>
			</section>

			<section class="links">
				<LinkList :links="collection.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'parent', 'root', 'license', 'cite-as']" />
			</section>

			<slot name="collection-after-details"></slot>
			
		</div>

	</div></article>
</template>

<script>
import BaseMixin from './BaseMixin.vue';
import CollectionSummary from './CollectionSummary.vue';
import DeprecationNotice from './DeprecationNotice.vue';
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import { MigrateCollections, Utils as CommonUtils } from '@openeo/js-commons';
import StacCollectionUtils from '../stacutils';
import './base.css';

export default {
	name: 'Collection',
	mixins: [BaseMixin],
	components: {
		CollectionSummary,
		Description,
		DeprecationNotice,
		LinkList
	},
	props: {
		collectionData: Object,
		initiallyCollapsed: {
			type: Boolean,
			default: false
		},
		mapOptions: {
			// It's not possible to specify defaults for the individual properties, therefore this prop is only accessed through a computed property which adds them in.
			default: function() { return {} },  // Don't remove! Must be a non-arrow factory function! When the prop is not given at all, this avoids having to deal with `undefined` in the computed-property-function.
			validator: function(value) {
				const allowedTypes = {  // keep in sync with Readme
					height: "string",
					width: "string",
					wrapAroundAntimeridian: "boolean",
					scrollWheelZoom: "boolean"
				};
				const allowedKeys = Object.keys(allowedTypes);
				return typeof value == 'object' && Object.keys(value).every(key =>
					allowedKeys.indexOf(key) != -1 && typeof value[key] == allowedTypes[key]
				);
			}
		}
	},
	data() {
		return {
			collapsed: false,
			collection: {},
			licenseUrl: false,
			map: null,
			stac: StacCollectionUtils
		}
	},
	computed: {
		temporalInterval() {
			let e = this.collection.extent;
			if (CommonUtils.isObject(e) && CommonUtils.isObject(e.temporal) && CommonUtils.size(e.temporal.interval) > 0 && e.temporal.interval[0].length >= 2) {
				return e.temporal.interval[0];
			}
			return null;
		},
		boundingBox() {
			let e = this.collection.extent;
			if (CommonUtils.isObject(e) && CommonUtils.isObject(e.spatial) && CommonUtils.size(e.spatial.bbox) > 0 && e.spatial.bbox[0].length >= 4) {
				return e.spatial.bbox[0];
			}
			return null;
		},
		leafletOptions() {
			return {  // keep in sync with Readme
				height: this.mapOptions.height || "300px",
				width: this.mapOptions.width || "auto",
				noWrap: this.mapOptions.wrapAroundAntimeridian === undefined ? true : !this.mapOptions.wrapAroundAntimeridian,  // negate!
				scrollWheelZoom: this.mapOptions.scrollWheelZoom === undefined ? true : this.mapOptions.scrollWheelZoom
			}
		},
		hasDimensions() {
			return CommonUtils.size(this.collection['cube:dimensions']) > 0;
		},
		hasSummaries() {
			return CommonUtils.size(this.collection.summaries) > 0;
		}
	},
	watch: {
		collectionData() {
			this.updateData();
		},
		collapsed(newVal) {
			if (!newVal) {
				// Wait with the map initialization until the collapsed area is rendered
				this.$nextTick(() => this.initMap());
			}
		}
	},
	beforeMount() {
		this.collapsed = this.initiallyCollapsed;
	},
	mounted() {
		if (!this.collapsed) {
			this.initMap();
		}
	},
	methods: {
		initMap() {
			if (!!this.$slots['collection-spatial-extent'] || this.map !== null) {
				return;
			}
			try {
				var L = require('leaflet');

				if (!L) {
					console.warn("Leaflet is not available");
				}
				var map = new L.Map('map-' + this.collection.id, {scrollWheelZoom: this.leafletOptions.scrollWheelZoom});
				var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					name: 'OpenStreetMap',
					attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
					noWrap: this.leafletOptions.noWrap
				});
				osm.addTo(map);

				var rect = L.rectangle([[this.boundingBox[3], this.boundingBox[0]], [this.boundingBox[1], this.boundingBox[2]]]);
				// ToDo: Use something like https://github.com/briannaAndCo/Leaflet.Antimeridian to show correct bboxes over the antimeridian
				rect.addTo(map);

				this.map = {
					instance: map,
					rectangle: rect
				};
				this.setMapSize(this.leafletOptions.height, this.leafletOptions.width);
			} catch (e) {}
		},
		setMapSize(height, width) {
			// Update map container in DOM
			this.$refs.mapContainer.style.width = width;
			this.$refs.mapContainer.style.height = height;
			this.map.instance.invalidateSize(true);
			// Compute somewhat smart map extent and zoom level around bbox
			var bounds = this.map.rectangle.getBounds();
			var zoom = this.map.instance.getBoundsZoom(bounds);
			var newZoom = Math.min(zoom, 11); // Never zoom closer than 8
			if (zoom > 8) {
				newZoom = newZoom - 3; // Zoom out three levels
			}
			else if (zoom > 5) {
				newZoom = newZoom - 2; // Zoom out two levels
			}
			else if (zoom > 2) {
				newZoom--; // Zoom out one level
			}
			this.map.instance.fitBounds(bounds);
			this.map.instance.setZoom(newZoom);
		},
		scrollToBands() {
			for(let field of ['eo:bands', 'sar:bands']) { // ToDo: sar:bands is deprecated => remove
				let id = 'summary_' + field;
				if (Array.isArray(this.$refs[id]) && this.$refs[id].length) {
					var elem = this.$refs[id][0];
					elem.scrollIntoView();
					elem.classList.add('highlight-box');
					setTimeout(() => {
						elem.classList.remove('highlight-box');
					}, 5000);
					break;
				}
			}
		},
		hasElements(data) {
			return (typeof data === 'object' && data !== null && Object.keys(data).length > 0);
		},
		updateData() {
			var data = MigrateCollections.convertCollectionToLatestSpec(this.collectionData, this.version);

			for(var key in data) {
				// Move all custom top-level fields to summaries for easier visualization
				if (key === 'version' || (key !== 'cube:dimensions' && key.includes(':'))) {
					data.summaries[key] = [data[key]];
				}
			}

			// ToDo: Use visualizations for something useful
			delete data.summaries['gee:visualizations'];

			for(var key in data.summaries) {
				data.summaries[key] = StacCollectionUtils.restructure(data.summaries[key], key);
			}

			this.collection = data;

			this.licenseUrl = false;
			for(let link in data.links) {
				if (link.rel === 'license' && link.href) {
					this.licenseUrl = l.href;
					break;
				}
			}
		},
		toggle() {
			if (this.initiallyCollapsed) {
				this.collapsed = !this.collapsed;
			}
		}
	}
}
</script>

<style scoped>
.dimension h4 {
	margin: 0;
}
.dimension .type {
	font-weight: normal;
	font-size: 90%;
	margin-left: 0.5em;
}
.provider-role {
	text-transform: capitalize;
}
.tabular {
	margin: 0.75em 0;
}
.tabular.wrap {
	display: block;
}
.tabular.wrap .value {
	margin-top: 0.5em;
	margin-left: 1em;
	margin-bottom: 2em;
}
.tabular .value ul {
	padding-left: 20px;
}
</style>