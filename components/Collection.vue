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

			<section class="extent">
				<h3>Temporal Extent</h3>
				<slot name="collection-temporal-extent" :extent="collection.extent.temporal">
					<p>{{ formatTemporalExtent(collection.extent.temporal) }}</p>
				</slot>
			
				<h3>Spatial Extent</h3>
				<slot name="collection-spatial-extent" :extent="collection.extent.spatial">
					<ul>
						<li>North: {{collection.extent.spatial[3]}}</li>
						<li>South: {{collection.extent.spatial[1]}}</li>
						<li>East: {{collection.extent.spatial[2]}}</li>
						<li>West: {{collection.extent.spatial[0]}}</li>
					</ul>
				</slot>
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

			<section class="properties" v-if="hasAdditionalValues">
				<h3>Additional information</h3>

				<div class="tabular" v-if="collection.version"><label>Collection Version:</label> <span class="value">{{ collection.version }}</span></div>

				<template v-if="hasProperties">
					<div class="tabular" v-for="(value, field) in collection.properties" :key="'properties_' + field" :set="formattedValue = formatStacValue(value, field)">
						<label>{{ formatStacKey(field) }}:</label>
						<div class="value" :set="tableKeys = isTable(value)">
							<table v-if="tableKeys" class="table">
								<thead>
									<tr>
										<th v-if="!Array.isArray(value)">&nbsp;</th>
										<th v-for="(key, i) in tableKeys" :key="i">{{ formatStacKey(key) }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(row, rowname) in value" :key="rowname">
										<th v-if="!Array.isArray(value)">{{ rowname }}</th>
										<td v-for="(key, i) in tableKeys" :key="i">{{ formatStacValue(row[key], key, field) }}</td>
									</tr>
								</tbody>
							</table>
							<ObjectTree v-else-if="typeof formattedValue === 'object'" :data="value" />
							<template v-else>{{ formattedValue }}</template>
						</div>
					</div>
				</template>
	
				<template v-if="hasOtherProperties">
					<div class="tabular" v-for="(value, field) in collection.other_properties" :key="'other_properties_' + field">
						<label>{{ formatStacKey(field) }}:</label>
						<div class="value">
							<template v-if="value.values">
								<template v-if="hasElements(value.values)">
									{{ formatValues(value.values, field) }}
								</template>
								<em v-else>None</em>
							</template>
							<template v-else-if="hasElements(value.extent)">
								{{ formatExtent(value.extent, field) }}
							</template>
							<em v-else>N/A</em>
						</div>
					</div>
				</template>

			</section>

			<section class="links" v-if="filteredLinks.length > 0">
				<h3>See Also</h3>
				<LinkList :links="filteredLinks" />
			</section>

			<slot name="collection-after-details"></slot>
			
		</div>

	</div></article>
</template>

<script>
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import ObjectTree from './ObjectTree.vue';
import { MigrateCollections, Utils as CommonUtils } from '@openeo/js-commons';
import Utils from '../utils.js';
import './base.css';

const STAC_FIELDS = {
	"dtr:start_datetime": {
		label: "Start date",
		format: "Timestamp"
	},
	"dtr:end_datetime": {
		label: "End date",
		format: "Timestamp"
	},
	"eo:gsd": {
		label: "Ground sample distance",
		suffix: "m"
	},
	"eo:platform": {
		label: "Platform"
	},
	"eo:constellation": {
		label: "Constellation"
	},
	"eo:instrument": {
		label: "Instrument / Sensor"
	},
	"eo:bands": {
		label: "Bands"
	},
	"eo:bands.gsd": {
		label: "GSD",
		suffix: "m"
	},
	"eo:bands.accuracy": {
		label: "Accuracy",
		suffix: "m"
	},
	"eo:bands.center_wavelength": {
		label: "Center Wavelength",
		suffix: "μm"
	},
	"eo:epsg": {
		label: "EPSG code"
	},
	"eo:cloud_cover": {
		label: "Cloud cover",
		suffix: "%"
	},
	"eo:off_nadir": {
		label: "Off-nadir angle",
		suffix: "º"
	},
	"eo:azimuth": {
		label: "Sun azimuth",
		suffix: "º"
	},
	"eo:sun_azimuth": {
		label: "Sun azimuth",
		suffix: "º"
	},
	"eo:sun_elevation": {
		label: "Sun elevation",
		suffix: "º"
	},
	"sar:platform": {
		label: "Platform"
	},
	"sar:constellation": {
		label: "Constellation"
	},
	"sar:instrument": {
		label: "Instrument / Sensor"
	},
	"sar:instrument_mode": {
		label: "Instrument mode"
	},
	"sar:frequency_band": {
		label: "Frequency band name"
	},
	"sar:center_wavelength": {
		label: "Center wavelength",
		suffix: "cm"
	},
	"sar:center_frequency": {
		label: "Center frequency",
		suffix: "GHz"
	},
	"sar:polarization": {
		label: "Polarization(s)"
	},
	"sar:bands": {
		label: "Bands"
	},
	"sar:pass_direction": {
		label: "Direction of the orbit"
	},
	"sar:type": {
		label: "Product type"
	},
	"sar:resolution": {
		label: "Resolution (range, azimuth)",
		suffix: "m"
	},
	"sar:pixel_spacing": {
		label: "Pixel spacing (range, azimuth)",
		suffix: "m"
	},
	"sar:looks": {
		label: "Groups of signal samples (looks)"
	},
	"sar:absolute_orbit": {
		label: "Absolute orbit numbers"
	},
	"sar:off_nadir": {
		label: "Viewing angle(s)",
	    suffix: "º"
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
	"gee:type": {
		label: "Earth Engine Data Type"
	},
	"gee:asset_schema": {
		label: "Earth Engine Image Properties"
	},
	"gee:cadence": {
		label: "Cadence"
	},
	"gee:revisit_interval": {
		label: "Revisit interval"
	},
	"cube:dimensions.extent": {
		label: "Extent",
		format: "Extent"
	},
	"cube:dimensions.values": {
		label: "Values",
		format: "CommaValues"
	}
};

export default {
	name: 'Collection',
	components: {
		Description,
		LinkList,
		ObjectTree
	},
	props: {
		version: {
			type: String,
			default: null
		},
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
			filteredLinks: []
		}
	},
	computed: {
		hasProperties() {
			return CommonUtils.isObject(this.collection.properties) && Object.keys(this.collection.properties).length > 0;
		},
		hasOtherProperties() {
			return CommonUtils.isObject(this.collection.other_properties) && Object.keys(this.collection.other_properties).length > 0;
		},
		hasAdditionalValues() {
			return this.collection.version || this.hasProperties || this.hasOtherProperties;
		}
	},
	watch: {
		version() {
			this.updateData();
		},
		collectionData() {
			this.updateData();
		}
	},
	created() {
		this.updateData();
	},
	beforeMount() {
		this.collapsed = this.initiallyCollapsed;
	},
	methods: {
		hasElements(data) {
			return (typeof data === 'object' && data !== null && Object.keys(data).length > 0);
		},
		updateData() {
			var data = MigrateCollections.convertCollectionToLatestSpec(this.collectionData, this.version);
			if (!Array.isArray(data.links)) {
				data.links = [];
			}
			this.collection = data;

			this.licenseUrl = false;
			this.filteredLinks = data.links.filter(l => {
				if (l.rel === 'license' && l.href) {
					this.licenseUrl = l.href;
				}
				return (typeof l.rel === 'undefined' || ['self', 'parent', 'root', 'license'].indexOf(l.rel) == -1);
			});
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

		isTable(value) {
			return Utils.isTableLike(value);
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
.tabular .value ul {
	padding-left: 20px;
}
</style>