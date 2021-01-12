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

			<section class="preview" v-if="thumbnails.length">
				<h3>Previews</h3>
				<div class="thumbnails">
					<a v-for="(img, i) in thumbnails" :key="i" :href="img.href" target="_blank">
						<img :src="img.href" :title="img.title" :alt="img.title || 'Preview'" />
					</a>
				</div>
			</section>

			<section class="license">
				<h3>License</h3>
				<a class="value" v-if="licenseUrl" :href="licenseUrl" target="_blank">{{ collection.license }}</a>
				<span class="value" v-else>{{ collection.license }}</span>
			</section>

			<section class="extent" v-if="temporalIntervals.length || boundingBoxes.length">
				<template v-if="temporalIntervals.length">
					<h3>Temporal Extent</h3>
					<slot name="collection-temporal-extents" :extents="temporalIntervals">
						<ul v-for="(interval, i) in temporalIntervals" :key="i">
							<li>{{ stac.formatTemporalExtent(interval) }}</li>
						</ul>
					</slot>
				</template>
			
				<template v-if="boundingBoxes.length">
				<h3>Spatial Extent</h3>
					<slot name="collection-spatial-extents" :extents="boundingBoxes">
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
				<div v-for="(value, field) in summaries" :key="'summary_' + field" :ref="'summary_' + field" class="tabular" :class="{wrap: stac.isTable(value) && value.isWide}">
					<label>{{ stac.formatKey(field) }}:</label>
					<div class="value">
						<CollectionSummary :value="value" :field="field" />
					</div>
				</div>
			</section>

			<section class="assets">
				<LinkList :links="assetLinks" heading="Assets" headingTag="h3" />
			</section>

			<section class="links">
				<LinkList :links="collection.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'parent', 'root', 'license', 'cite-as']" />
			</section>

			<slot name="collection-after-details"></slot>
			
		</div>

	</div></article>
</template>

<script>
import CollectionSummary from './internal/CollectionSummary.vue';
import DeprecationNotice from './DeprecationNotice.vue';
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import StacCollectionUtils from '../stacutils';
import Utils from '../utils';

const IMAGE_MEDIA_TYPES = ['image/apng', 'image/gif', 'image/png', 'image/jpeg', 'image/webp'];

export default Utils.enableHtmlProps({
	name: 'Collection',
	components: {
		CollectionSummary,
		Description,
		DeprecationNotice,
		LinkList
	},
	props: {
		collection: {
			type: Object,
			default: () => ({})
		},
		initiallyCollapsed: {
			type: Boolean,
			default: false
		},
		mapOptions: {
			// It's not possible to specify defaults for the individual properties, therefore this prop is only accessed through a computed property which adds them in.
			default: () => ({}),
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
			map: null,
			stac: StacCollectionUtils
		}
	},
	computed: {
		summaries() {
			let summaries = Object.assign({}, this.collection.summaries);

			for(let key in this.collection) {
				// Move all custom top-level fields to summaries for easier visualization
				if (key === 'version' || (key !== 'cube:dimensions' && key.includes(':'))) {
					summaries[key] = [this.collection[key]];
				}
			}

			// ToDo: Use visualizations for something useful
			delete summaries['gee:visualizations'];

			for(let key in summaries) {
				summaries[key] = StacCollectionUtils.restructure(summaries[key], key);
			}

			return summaries;
		},
		temporalIntervals() {
			let e = this.collection.extent;
			if (Utils.isObject(e) && Utils.isObject(e.temporal) && Utils.size(e.temporal.interval) > 0) {
				return e.temporal.interval.filter(interval => Array.isArray(interval) && interval.length >= 2);
			}
			return [];
		},
		boundingBoxes() {
			let e = this.collection.extent;
			if (Utils.isObject(e) && Utils.isObject(e.spatial) && Utils.size(e.spatial.bbox) > 0) {
				return e.spatial.bbox.filter(bbox => Array.isArray(bbox) && bbox.length >= 4);
			}
			return [];
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
			return Utils.size(this.collection['cube:dimensions']) > 0;
		},
		hasSummaries() {
			return Utils.size(this.summaries) > 0;
		},
		assetLinks() {
			if (!Utils.isObject(this.collection.assets)) {
				return [];
			}
			return Object.values(this.collection.assets)
				// Remove all thumbnails (covered by separate thumbnails viewer)
				.filter(a => !this.assetIsImage(a))
				// Convert from asset to links so that LinkList can be used
				.map(a => {
					if (Array.isArray(a.role) && a.roles.length > 0) {
						a.rel = a.roles.join(' ');
						delete a.roles;
					}
					return a;
				});
		},
		thumbnails() {
			if (!Utils.isObject(this.collection.assets)) {
				return [];
			}
			return Object.values(this.collection.assets).filter(this.assetIsImage);
		},
		licenseUrl() {
			if (Array.isArray(this.collection.links)) {
				for(let link of this.collection.links) {
					if (link.rel === 'license' && link.href) {
						return link.href;
					}
				}
			}
			return false;
		}
	},
	watch: {
		collapsed(newVal) {
			if (!newVal) {
				// Wait with the map initialization until the collapsed area is rendered
				this.$nextTick(() => this.initMap());
			}
			else {
				this.map = null;
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
		assetIsImage(asset) {
			return Array.isArray(asset.roles) && asset.roles.includes('thumbnail') && IMAGE_MEDIA_TYPES.includes(asset.type);
		},
		initMap() {
			if (!!this.$slots['collection-spatial-extents'] || this.map !== null) {
				return;
			}
			try {
				var L = require('leaflet');
				if (!L) {
					console.warn("Leaflet is not available");
					return;
				}
	
				var map = new L.Map(this.$refs.mapContainer, {scrollWheelZoom: this.leafletOptions.scrollWheelZoom});
				var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					name: 'OpenStreetMap',
					attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
					noWrap: this.leafletOptions.noWrap
				});
				osm.addTo(map);

				let features = L.featureGroup();
				features.addTo(map);

				try {
					L.Wrapped = require('leaflet.antimeridian');
				} catch (e) {
					console.warn("Leaflet Antimeridian plugin is not available");
				}
				for(let bbox of this.boundingBoxes) {
					let p = [[bbox[1], bbox[0]], [bbox[3], bbox[0]], [bbox[3], bbox[2]], [bbox[1], bbox[2]]];
					let rect;
					if (L.Wrapped && bbox[2] < bbox[0]) {
						rect = new L.Wrapped.Polygon(p);
					}
					else {
						rect = L.polygon(p);
					}
					rect.setStyle({
						color: '#3388ff',
						fillOpacity: 0.2
					});
					features.addLayer(rect);
				}

				this.map = {
					instance: map,
					rectangles: features
				};

				this.setMapSize(this.leafletOptions.height, this.leafletOptions.width);
				if (typeof this.mapOptions.onAfterMapInit === 'function') {
					typeof this.mapOptions.onAfterMapInit(map, features);
				}
			} catch (e) {
				console.error(e);
			}
		},
		setMapSize(height, width) {
			// Update map container in DOM
			this.$refs.mapContainer.style.width = width;
			this.$refs.mapContainer.style.height = height;
			this.map.instance.invalidateSize(true);
			// Compute somewhat smart map extent and zoom level around bbox
			var bounds = this.map.rectangles.getBounds();
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
		toggle() {
			if (this.initiallyCollapsed) {
				this.collapsed = !this.collapsed;
			}
		}
	}
})
</script>

<style>
@import url('./base.css');
@import url('../node_modules/leaflet/dist/leaflet.css');
</style>

<style scoped>
.map {
	background: transparent;
}
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
.links:empty, .assets.empty {
	display: none;
}
.thumbnails {
	overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    white-space: nowrap;
	padding: 5px;
}
.thumbnails a {
	border: 5px solid transparent;
	display: inline-block;
}

.thumbnails a:hover img {
	border: 2px solid black;
}
.thumbnails a img {
	max-height: 200px;
	border: 2px solid white;
	vertical-align: middle;
}
</style>