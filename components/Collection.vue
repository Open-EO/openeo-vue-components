<template>
	<article class="vue-component collection">
		<a class="anchor" :name="collection.id"></a>
		<h2>{{ collection.id }}</h2>

		<slot name="collection-before-summary"></slot>

		<div class="summary" v-if="collection.title">
			<div class="collection-bar">
				<ul class="badges">
					<!-- Add badges for license and version -->
					<li class="badge license">
						<a v-if="licenseUrl" :href="licenseUrl" target="_blank">
							License: {{ collection.license }}
						</a>
						<template v-else>License: {{ collection.license }}</template>
					</li>
					<li class="badge version" v-if=" collection.version">Version: {{ collection.version }}</li>
				</ul>
			</div>
			<summary>{{collection.title}}</summary>
		</div>

		<slot name="collection-after-summary"></slot>

		<button v-if="initiallyCollapsed" class="show-more-button" @click="toggle()">Show {{collapsed ? 'more' : 'less'}}</button>

		<div v-show="!collapsed">

			<slot name="collection-before-details"></slot>

			<section class="description" v-if="collection.description">
				<h3>Description</h3>
				<Description :description="collection.description"></Description>
				<p v-if="collection.keywords"><strong>Keywords: </strong><ul class="comma-separated-list">
					<li v-for="(keyword, i) in collection.keywords" :key="i">{{ keyword }}</li>
				</ul></p>
			</section>

			<section class="extent">
				<h3>Spatial Extent</h3>

				<slot name="collection-spatial-extent" :extent="collection.extent.spatial">
					<ul>
						<li>North: {{collection.extent.spatial[3]}}</li>
						<li>South: {{collection.extent.spatial[1]}}</li>
						<li>East: {{collection.extent.spatial[2]}}</li>
						<li>West: {{collection.extent.spatial[0]}}</li>
					</ul>
				</slot>

				<h3>Temporal Extent</h3>
				<slot name="collection-temporal-extent" :extent="collection.extent.temporal">
					<p>{{ formatTemporalExtent(collection.extent.temporal) }}</p>
				</slot>
			</section>

			<section class="providers" v-if="collection.providers">
				<h3>Providers</h3>
                <ol>
					<li v-for="(provider, key) in collection.providers" :key="key">
						<a v-if="provider.url" :href="provider.url" target="_blank">{{ provider.name }}</a>
						<template v-else>{{ provider.name }}</template>
						<template v-if="Array.isArray(provider.roles) && provider.roles.length > 0">
							(<ul class="comma-separated-list">
								<li v-for="(role, r) in provider.roles" :key="r" class="provider-role">{{ role }}</li>
							</ul>)
						</template>
						<Description v-if="provider.description" :description="provider.description" />
					</li>
                </ol>
			</section>

			<section class="properties" v-if="collection.properties">
				<h3>Additional information</h3>
                <dl v-for="(value, key) in collection.properties" :key="key" :set="formattedValue = formatStacValue(value, key)">
                    <dt>{{ formatStacKey(key) }}</dt>
                    <dd>
						<ObjectTree v-if="typeof formattedValue === 'object'" :data="value" />
						<template v-else>{{ formattedValue }}</template>
					</dd>
                </dl>
			</section>

			<section class="links" v-if="filteredLinks.length > 0">
				<h3>See Also</h3>
				<LinkList :links="filteredLinks" />
			</section>

			<slot name="collection-after-details"></slot>
			
		</div>

	</article>
</template>

<script>
import Description from './Description.vue';
import LinkList from './LinkList.vue';
import ObjectTree from './ObjectTree.vue';
import { MigrateCollections } from '@openeo/js-commons';
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
			collapsed: false
		}
	},
	computed: {
		collection() {
			var data = MigrateCollections.convertCollectionToLatestSpec(this.collectionData, this.version);
			if (!Array.isArray(data.links)) {
				data.links = [];
			}
			return data;
		},
		licenseUrl() {
			for (var i in this.collection.links) {
				var link = this.collection.links[i];
				if (link.rel === 'license' && link.href) {
					return link.href;
				}
			}
			return false;
		},
		filteredLinks() {
			return this.collection.links.filter(l => typeof l.rel === 'undefined' || ['self', 'parent', 'root'].indexOf(l.rel) == -1);
		}
	},
	beforeMount() {
		this.collapsed = this.initiallyCollapsed;
	},
	methods: {
		toggle() {
			this.collapsed = !this.collapsed;
		},
		formatTemporalExtent(extent) {
			if (extent[0] == extent[1]) {
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
			return key;
		},
		formatStacValue(value, key) {
			if (typeof STAC_FIELDS[key] === 'object') {
				var info = STAC_FIELDS[key];

				var isScalarArray = false;
				if (Array.isArray(value)) {
					isScalarArray = true;
					for(var i in value) {
						if (typeof value[i] === 'object') {
							isArray = false;
							break;
						}
					}
					if (isScalarArray) {
						for(var i in value) {
							value[i] = this.formatStacValue(value[i]);
						}
					}
				}

				if (typeof info.format === 'function') {
					return info.format(value, key);
				}
				else if (typeof this['format' + info.format] === 'function') {
					return this['format' + info.format](value);
				}

				if (value === 'null') {
					return "N/A";
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
		}
	}
}
</script>

<style scoped>
.badges {
	margin: 0 0 0.75em 0;
	padding: 0;
	list-style-type: none;
	display: inline-block;
}
.badges .badge {
	display: inline-block;
	font-size: 0.8em;
	margin: 0 0.5em 0.5em 0;
	padding: 0.3em 0.5em;
	line-height: 1;
	text-align: center;
	white-space: nowrap;
	text-transform: uppercase;
	vertical-align: baseline;
	border-radius: 3px;
	color: #fff;
}
.badges .badge a {
	margin: -0.3em -0.5em;
	padding: 0.3em 0.5em;
	color: #fff;
	display: block;
}
.badges .badge a:hover {
	color: #fff;
}
.badges .license {
	background-color: maroon;
}
.badges .version {
	background-color: darkblue;
}
.provider-role {
	text-transform: capitalize;
}
</style>