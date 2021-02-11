<template>
	<article class="vue-component collection">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="collection.id"></a>
			<h2>{{ collection.id }}</h2>
		</slot>

		<summary v-if="collection.title">{{collection.title}}</summary>

		<slot name="before-description" v-bind="$props"></slot>

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
			<span v-html="license" />
		</section>

		<section class="extent" v-if="temporalIntervals.length || boundingBoxes.length">
			<template v-if="temporalIntervals.length">
				<h3>Temporal Extent</h3>
				<slot name="temporal-extents" :extents="temporalIntervals">
					<ul v-for="(interval, i) in temporalIntervals" :key="i">
						<li>{{ stac.Formatters.formatTemporalExtent(interval) }}</li>
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

		<section class="dimensions" v-if="hasDimensions">
			<h3>Data Cube Dimensions</h3>
			<ul>
				<li v-for="(dim, name) in collection['cube:dimensions']" :key="name" class="dimension">
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
							<template v-if="dim.type === 'temporal'">{{ stac.Formatters.formatTemporalExtent(dim.extent) }}</template>
							<template v-else>{{ stac.Formatters.formatExtent(dim.extent) }}</template>
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

		<section class="summaries" v-if="hasSummaries">
			<template v-for="group in summaries">
				<h3 v-html="group.label" :key="group.extension" />
				<div v-for="(prop, field) in group.properties" :key="'summary_' + field" :ref="'summary_' + field" class="tabular" :class="{wrap: Boolean(prop.custom || prop.items)}">
					<label :title="field" v-html="stac.label(field)" />
					<div v-if="prop.items" class="value">
						<table v-for="(value, i) in prop.formatted" :key="i" class="table">
							<thead>
								<tr>
									<th v-if="!Array.isArray(value)">&nbsp;</th>
									<th v-for="(spec, col) in prop.items" :key="col" v-html="stac.label(col, prop.items)"></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row, i) in prop.formatted[i]" :key="i">
									<th v-if="!Array.isArray(value)">{{ i }}</th>
									<td v-for="(spec, col) in prop.items" :key="col" v-html="row[col]" />
								</tr>
							</tbody>
						</table>
					</div>
					<div v-else-if="prop.formatted" class="value" v-html="prop.formatted" />
					<div class="value" v-else>{{ prop.value }}</div>
				</div>
			</template>
		</section>

		<section class="assets">
			<LinkList :links="assetLinks" heading="Assets" headingTag="h3" />
		</section>

		<section class="links">
			<LinkList :links="collection.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'parent', 'root', 'license', 'cite-as']" />
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import StacFields from '@radiantearth/stac-fields';
import Utils from '../utils';

const IMAGE_MEDIA_TYPES = ['image/apng', 'image/gif', 'image/png', 'image/jpeg', 'image/webp'];

StacFields.Registry.externalRenderer = true;
StacFields.Registry.addMetadataFields({
	"eo:platform": {
		alias: "platform"
	},
	"eo:instrument": {
		alias: "instruments"
	},
	"gee:type": {
		label: "Collection Type",
		formatter: StacFields.label
	}
});

export default {
	name: 'Collection',
	components: {
		Description: () => import('./Description.vue'),
		DeprecationNotice: () => import('./DeprecationNotice.vue'),
		LinkList: () => import('./LinkList.vue')
	},
	props: {
		collection: {
			type: Object,
			default: () => ({})
		},
		mapOptions: {
			// It's not possible to specify defaults for the individual properties, therefore this prop is only accessed through a computed property which adds them in.
			type: Object,
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
			map: null,
			stac: StacFields
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

			let collection = Object.assign({}, this.collection, {summaries});
			return StacFields.formatSummaries(collection);
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
				scrollWheelZoom: this.mapOptions.scrollWheelZoom === undefined ? false : this.mapOptions.scrollWheelZoom
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
		license() {
			if (typeof this.collection.license !== 'string' || this.collection.license.length === 0) {
				return false;
			}
			
			return this.stac.Formatters.formatLicense(this.collection.license, null, null, this.collection);
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	mounted() {
		this.initMap();
	},
	methods: {
		assetIsImage(asset) {
			return Array.isArray(asset.roles) && asset.roles.includes('thumbnail') && IMAGE_MEDIA_TYPES.includes(asset.type);
		},
		async initMap() {
			if (!this.$refs.mapContainer) {
				await this.$nextTick();
			}
			if (!this.$refs.mapContainer || this.map !== null || this.boundingBoxes.length === 0) {
				return;
			}
			try {
				var L = require('leaflet');
				if (!L) {
					console.warn("Leaflet is not available");
					return;
				}
	
				import('leaflet/dist/leaflet.css');
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
			this.map.instance.invalidateSize(false);
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

			this.map.instance.once('moveend zoomend', () => this.map.instance.invalidateSize(false));
		},
		scrollToBands(evt) {
			let id = 'summary_eo:bands';
			if (Array.isArray(this.$refs[id]) && this.$refs[id].length) {
				var elem = this.$refs[id][0];
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

.vue-component.collection .map {
	background: transparent;
}
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
.vue-component.collection .tabular {
	margin: 0.5em 0;
}
.vue-component.collection .tabular.wrap {
	display: block;
}
.vue-component.collection .tabular.wrap .value {
	margin-top: 0.5em;
	margin-left: 1em;
	margin-bottom: 2em;
}
.vue-component.collection .tabular .value ul {
	padding-left: 20px;
}
.vue-component.collection .links:empty, .assets.empty {
	display: none;
}
.vue-component.collection .thumbnails {
	overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    white-space: nowrap;
	padding: 5px;
}
.vue-component.collection .thumbnails a {
	border: 5px solid transparent;
	display: inline-block;
}

.vue-component.collection .thumbnails a:hover img {
	border: 2px solid black;
}
.vue-component.collection .thumbnails a img {
	max-height: 200px;
	border: 2px solid white;
	vertical-align: middle;
}

.vue-component.collection .summaries .table {
	width: 100%;
	border-collapse: collapse;
}
.vue-component.collection .summaries .table th {
	text-align: left;
	background-color: #eee;
}
.vue-component.collection .summaries .table td,
.vue-component.collection .summaries .table th {
	border: 1px solid #ccc;
	padding: 3px;
}
.vue-component.collection .summaries .table td {
	vertical-align: top;
}
.vue-component.collection .summaries .descrption p:first-of-type {
	margin-top: 0;
}
.vue-component.collection .summaries .descrption p:last-of-type {
	margin-bottom: 0;
}
.vue-component.collection .summaries .table tr:hover {
	background-color: #f9f9f9;
}
</style>