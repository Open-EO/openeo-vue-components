<template>
	<div class="vue-component items">
		<SearchableList :data="data" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed" :loadAdditionalData="loadAdditionalData" @summaries="updateFeatures" @detailsToggled="detailsToggled" ref="list">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #after-search-box>
				<slot v-if="showMap" name="map" :geojson="geojson" :mapOptions="mapOptions">
					<div class="map overview" ref="mapContainer"></div>
				</slot>
			</template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<Item :data="slot.item" :mapOptions="mapOptions">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="item-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="item-end" v-bind="scope" /></template>
					<template #location="scope"><slot name="item-location" v-bind="scope" /></template>
				</Item>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';
import StacMixin from './internal/StacMixin';

const geoJsonStyle = {
	color: '#3388ff',
	fillOpacity: 0.2
};

export default {
	name: 'Items',
	components: {
		Item: () => Utils.loadAsyncComponent(import('./Item.vue')),
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue'))
	},
	props: {
		items: {
			type: [Array, Object], // Either a GeoJSON FeatureCollection or an array of Items
			default: () => ([])
		},
		showMap: {
			type: Boolean,
			default: false
		},
		mapOptions: StacMixin.props.mapOptions,
		searchTerm: {
			type: String,
			default: null
		},
		sort: {
			type: Boolean,
			default: true
		},
		offerDetails: {
			type: Boolean,
			default: true
		},
		heading: {
			type: String,
			default: 'Items'
		},
		collapsed: {
			type: Boolean,
			default: null
		},
		loadAdditionalData: {
			type: Function,
			default: null
		}
	},
	data() {
		return Object.assign(StacMixin.data(), {
			summaries: []
		});
	},
	computed: {
		leafletOptions: StacMixin.computed.leafletOptions,
		data() {
			if (Array.isArray(this.items)) {
				return this.items;
			}
			else if (Utils.isObject(this.items) && this.items.type === 'FeatureCollection' && Array.isArray(this.items.features)) {
				return this.items.features;
			}
			else {
				return [];
			}
		},
		geojson() {
			let geojson = {
				type: "FeatureCollection",
				features: []
			}
			for(let summary of this.summaries) {
				if (!summary.show) {
					continue;
				}
				geojson.features.push(this.data[summary.index]);
			}
			return geojson;
		}
	},
	watch: {
		showMap: StacMixin.watch.showMap,
		geojson() {
			if (!this.map) {
				this.initMap();
			}
			else {
				this.setFeatures();
			}
		}
	},
	beforeCreate: StacMixin.beforeCreate,
	mounted: StacMixin.mounted,
	methods: {
		initMap: StacMixin.methods.initMap,
		updateMapView: StacMixin.methods.updateMapView,
		updateFeatures(summaries) {
			this.summaries = summaries;
		},
		addFeatures() {
			this.setFeatures(false);
			return this.map.geometries;
		},
		setFeatures(addToMap = true) {
			if (!this.map || !this.map.instance) {
				return;
			}
			if (this.map.geometries) {
				this.map.geometries.remove();
			}

			let geom = this.map.leaflet.geoJSON(this.geojson, {
				style: geoJsonStyle
			});
			geom.on('click', e => {
  				var pt = this.map.leaflet.latLngBounds(e.latlng, e.latlng);
				geom.eachLayer(layer => {
					let bounds = layer.getBounds();
					let index = this.summaries.findIndex(d => d.identifier === layer.feature.id);
					this.$refs.list.toggleDetails(index, pt.intersects(bounds));
				});
			});
			if (addToMap) {
				geom.addTo(this.map.instance);
			}
			this.map.geometries = geom;
		},
		detailsToggled(...args) {
			this.$emit('detailsToggled', ...args);
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.items {
	.map.overview {
		margin-bottom: 1em;
	}
}
</style>