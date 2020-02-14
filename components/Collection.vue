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
						<p>{{ formatTemporalExtent(temporalInterval) }}</p>
					</slot>
				</template>
			
				<template v-if="boundingBox">
				<h3>Spatial Extent</h3>
					<slot name="collection-spatial-extent" :extent="boundingBox">
						<div id="map" ref="mapContainer">
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
				<table class="table">
					<thead>
						<tr>
							<th>&nbsp;</th>
							<th v-for="(key, i) in cubeHeader" :key="i">{{ formatStacKey(key) }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(row, rowname) in collection['cube:dimensions']" :key="rowname">
							<th>{{ rowname }}</th>
							<td v-for="(key, i) in cubeHeader" :key="i">{{ formatStacValue(row[key], key, 'cube:dimensions') }}</td>
						</tr>
					</tbody>
				</table>
			</section>

			<section class="summaries" v-if="hasSummaries">
				<h3>Additional information</h3>
				<div v-for="(value, field) in collection.summaries" :key="'summary_' + field" class="tabular" :class="{wrap: isTable(value) && value.isWide}">
					<label>{{ formatStacKey(field) }}:</label>
					<div class="value">
						<table v-if="isTable(value)" class="table">
							<thead>
								<tr>
									<th v-if="!Array.isArray(value.data)">&nbsp;</th>
									<th v-for="(key, i) in value.header" :key="i">{{ formatStacKey(key) }}</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row, rowname) in value.data" :key="rowname">
									<th v-if="!Array.isArray(value.data)">{{ rowname }}</th>
									<td v-for="(key, i) in value.header" :key="i">
										<ObjectTree v-if="row[key] && typeof row[key] === 'object'" :data="row[key]" />
										<template v-else>{{ formatStacValue(row[key], key, field) }}</template>
									</td>
								</tr>
							</tbody>
						</table>
						<ObjectTree v-else-if="typeof value === 'object'" :data="value" />
						<template v-else>{{ formatStacValue(value, field) }}</template>
					</div>
				</div>
			</section>

			<section class="links">
				<LinkList :links="collection.links" heading="See Also" headingTag="h3" :ignoreRel="['self', 'parent', 'root', 'license']" />
			</section>

			<slot name="collection-after-details"></slot>
			
		</div>

	</div></article>
</template>

<script>
import BaseMixin from './BaseMixin.vue';
import DeprecationNotice from './DeprecationNotice.vue';
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import ObjectTree from './ObjectTree.vue';
import { MigrateCollections, Utils as CommonUtils } from '@openeo/js-commons';
import Utils from '../utils.js';
import './base.css';

const STAC_FIELDS = {
	"version": {
		label: "Collection Version"
	},
	"deprecated": {
		label: "Deprecated"
	},
	"datetime": {
		label: "Dates",
		format: "Timestamp"
	},
	"start_datetime": {
		label: "Start dates",
		format: "Timestamp"
	},
	"end_datetime": {
		label: "End dates",
		format: "Timestamp"
	},
	"platform": {
		label: "Platform"
	},
	"constellation": {
		label: "Constellation"
	},
	"instruments": {
		label: "Instrument / Sensor"
	},
	"mission": {
		label: "Mission"
	},
	"sat:orbit_state": {
		label: "Orbit state"
	},
	"sat:relative_orbit": {
		label: "Relative orbit numbers"
	},
	"eo:gsd": {
		label: "Ground sample distance",
		suffix: "m"
	},
	"eo:bands": {
		label: "Spectral Bands"
	},
	"eo:bands.gsd": {
		label: "GSD",
		suffix: "m"
	},
	"eo:bands.center_wavelength": {
		label: "Wavelength",
		suffix: "μm"
	},
	"eo:cloud_cover": {
		label: "Cloud cover",
		suffix: "%"
	},
	"proj:epsg": {
		label: "EPSG code"
	},
	"view:off_nadir": {
		label: "Off-nadir angle",
		suffix: "º"
	},
	"view:azimuth": {
		label: "Sun azimuth",
		suffix: "º"
	},
	"view:sun_azimuth": {
		label: "Sun azimuth",
		suffix: "º"
	},
	"view:sun_elevation": {
		label: "Sun elevation",
		suffix: "º"
	},
	"view:incidence_angle": {
		label: "Incidence angle",
		suffix: "º"
	},
	"sar:instrument_mode": {
		label: "Instrument mode"
	},
	"sar:frequency_band": {
		label: "Frequency band name"
	},
	"sar:center_frequency": {
		label: "Center frequency",
		suffix: "GHz"
	},
	"sar:polarization": {
		label: "Polarizations"
	},
	"sar:product_type": {
		label: "Product type"
	},
	"sar:bands": {
		label: "SAR Bands"
	},
	"sar:pass_direction": {
		label: "Direction of the orbit"
	},
	"sar:type": {
		label: "Product type"
	},
	"sar:resolution_range": {
		label: "Range Resolution",
		suffix: "m"
	},
	"sar:sar:resolution_azimuth": {
		label: "Azimuth Resolution",
		suffix: "m"
	},
	"sar:pixel_spacing_range": {
		label: "Range pixel spacing",
		suffix: "m"
	},
	"sar:pixel_spacing_azimuth": {
		label: "Azimuth pixel spacing",
		suffix: "m"
	},
	"sar:looks_range": {
		label: "Number of range looks"
	},
	"sar:looks_azimuth": {
		label: "Number of azimuth looks"
	},
	"sar:looks_equivalent_number": {
		label: "Equivalent number of looks (ENL):"
	},
	"sar:observation_direction": {
		label: "Antenna pointing direction"
	},
	"sci:doi": {
		label: "DOI"
	},
	"sci:citation": {
		label: "Recommended citation"
	},
	"sci:publications": {
		label: "Related publications"
	},
	"cube:dimensions.extent": {
		label: "Extent",
		format: "Extent"
	},
	"cube:dimensions.values": {
		label: "Values"
	}
};

export default {
	name: 'Collection',
	mixins: [BaseMixin],
	components: {
		Description,
		DeprecationNotice,
		LinkList,
		ObjectTree
	},
	props: {
		collectionData: Object,
		initiallyCollapsed: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			collapsed: false,
			collection: {},
			licenseUrl: false,
			map: null
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
		hasDimensions() {
			return CommonUtils.size(this.collection['cube:dimensions']) > 0;
		},
		cubeHeader() {
			if (this.hasDimensions) {
				return this.tableHeader(this.collection['cube:dimensions']);
			}
			return [];
		},
		hasSummaries() {
			return CommonUtils.size(this.collection.summaries) > 0;
		}
	},
	watch: {
		collectionData() {
			this.updateData();
		}
	},
	beforeMount() {
		this.collapsed = this.initiallyCollapsed;
	},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			if (!!this.$slots['collection-spatial-extent']) {
				return;
			}
			console.log('leaflet');
			try {
				var L = require('leaflet');

				var map = new L.Map('map');
				var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					name: 'OpenStreetMap',
					attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
				});
				osm.addTo(map);

				var rect = L.rectangle([[this.boundingBox[3], this.boundingBox[0]], [this.boundingBox[1], this.boundingBox[2]]]);	
				rect.addTo(map);

				this.map = {
					instance: map,
					rectangle: rect
				};
				this.setMapSize("300px");
			} catch (e) {}
		},
		setMapSize(height, width = null) {
				this.$refs.mapContainer.style.width = width ? width : 'auto';
				this.$refs.mapContainer.style.height = height;
				this.map.instance.invalidateSize(true);
				this.map.instance.fitBounds(this.map.rectangle.getBounds());
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

			for(var key in data.summaries) {
				let val = data.summaries[key];

				if (Array.isArray(val) && val.length === 1) {
					val = val[0];
				}

				let tableHeaders = this.tableHeader(val);
				if (tableHeaders.length > 0) {
					val = {
						isTable: true,
						isWide: tableHeaders.length >= 2,
						header: tableHeaders,
						data: val
					};
				}

				data.summaries[key] = val;
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
		formatExtent(extent, key = null) {
			var v1 = key === null ? extent[0] : this.formatStacValue(extent[0], key);
			var v2 = key === null ? extent[1] : this.formatStacValue(extent[1], key);
			if (v1 === null) {
				return "Until " + v2;
			}
			else if (v2 === null) {
				return "From " + v1;
			}
			else {
				return v1 + ' to ' + v2;
			}
		},
		formatValues(values, key) {
			return this.formatCommaValues(values.map(v => this.formatStacValue(v, key)));
		},
		formatCommaValues(values) {
			return values.join(', ');
		},
		toggle() {
			if (this.initiallyCollapsed) {
				this.collapsed = !this.collapsed;
			}
		},
		formatTemporalExtent(extent) {
			if (!Array.isArray(extent) || extent.length < 2) {
				return "N/A";
			}
			else if (extent[0] == extent[1]) {
				return this.formatTimestamp(extent[0]);
			}
			else if (extent[0] === null) {
				return "Until " + this.formatTimestamp(extent[1]);
			}
			else if (extent[1] === null) {
				return this.formatTimestamp(extent[0]) + " until present";
			}
			else {
				return this.formatTimestamp(extent[0]) + ' – ' + this.formatTimestamp(extent[1]);
			}
		},
		formatTimestamp(datetime) {
			return datetime.replace('T', ' ').replace('Z', ' UTC');
		},
		formatStacKey(key) {
			if (typeof STAC_FIELDS[key] === 'object') {
				return STAC_FIELDS[key].label;
			}
			else if (key.indexOf(':') !== -1) {
				key = key.substr(key.indexOf(':')+1);
			}
			return Utils.prettifyString(key);
		},
		formatStacValue(value, key, parentField = null) {
			if (typeof value === 'undefined') {
				return 'N/A';
			}

			if (CommonUtils.isObject(value) && typeof value.min !== 'undefined' && typeof value.max !== 'undefined') {
				return this.formatExtent([value.min, value.max], key);
			}

			var fieldName = parentField ? parentField + "." + key : key;
			if (typeof STAC_FIELDS[fieldName] === 'object') {
				var info = STAC_FIELDS[fieldName];

				if (typeof info.format === 'function') {
					return info.format(value, key);
				}
				else if (typeof this['format' + info.format] === 'function') {
					return this['format' + info.format](value);
				}

				var isScalarArray = false;
				if (Array.isArray(value)) {
					isScalarArray = true;
					for(var i in value) {
						if (typeof value[i] === 'object') {
							isScalarArray = false;
							break;
						}
					}
					if (isScalarArray) {
						for(var i in value) {
							value[i] = this.formatStacValue(value[i]);
						}
					}
				}

				if (value === 'null') {
					return "None";
				}
				else if (value === true) {
					return '✔️';
				}
				else if (value === false) {
					return '❌';
				}

				if (info.suffix && (typeof value === 'string' || typeof value === 'number')) {
					return value + ' ' + info.suffix;
				}

				if (isScalarArray) {
					return '[ ' + value.join(', ') + ' ]';
				}
			}
			return value;
		},

		tableHeader(value) {
			return Utils.isTableLike(value);
		},

		isTable(value) {
			return CommonUtils.isObject(value) && value.isTable;
		}
	}
}
</script>

<style scoped>
.provider-role {
	text-transform: capitalize;
}
.table {
	width: 100%;
	border-collapse: collapse;
}
.table th {
	text-align: left;
	background-color: #eee;
}
.table td, .table th {
	border: 1px solid #ccc;
	padding: 3px;
}
.table tr:hover {
	background-color: #f9f9f9;
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