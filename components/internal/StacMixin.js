import Utils from '../../utils';
import { Versions } from '@openeo/js-commons';

const IMAGE_MEDIA_TYPES = ['image/apng', 'image/gif', 'image/png', 'image/jpeg', 'image/webp'];
const IMAGE_EXTENSIONS = ['gif', 'png', 'jpg', 'jpeg', 'webp'];

export default {
	components: {
		Description: () => import('../Description.vue'),
		DeprecationNotice: () => import('../DeprecationNotice.vue'),
		LinkList: () => import('../LinkList.vue'),
		StacFields: () => import('../internal/StacFields.vue')
	},
	props: {
		data: {
			type: Object,
			default: () => ({})
		},
		mapOptions: {
			// It's not possible to specify defaults for the individual properties, therefore this prop is only accessed through a computed property which adds them in.
			type: Object,
			// Default values will be set in computed.leafletOptions
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
			map: null
		};
	},
	computed: {
		leafletOptions() {
			return {  // keep in sync with Readme
				height: this.mapOptions.height || "250px",
				width: this.mapOptions.width || "auto",
				noWrap: this.mapOptions.wrapAroundAntimeridian === undefined ? true : !this.mapOptions.wrapAroundAntimeridian,  // negate!
				scrollWheelZoom: this.mapOptions.scrollWheelZoom === undefined ? false : this.mapOptions.scrollWheelZoom
			}
		},
		assetLinks() {
			if (!Utils.isObject(this.data.assets)) {
				return [];
			}
			return Object.values(this.data.assets)
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
			if (!Utils.isObject(this.data.assets)) {
				return [];
			}
			return Object.values(this.data.assets).filter(this.assetIsImage);
		}
	},
	watch: {
		data() {
			this.initMap();
		},
		showMap(val) {
			if (val) {
				this.initMap();
			}
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
			let ext = typeof asset.href === 'string' ? asset.href.split('.').pop() : '';
			return Array.isArray(asset.roles) && 
				(asset.roles.includes('thumbnail') || asset.roles.includes('overview')) && 
				(IMAGE_MEDIA_TYPES.includes(asset.type) || IMAGE_EXTENSIONS.includes(ext));
		},
		initLeafletPlugins() {
			// To be implemented in Collection/Item, if required.
		},
		async initMap() {
			if (!this.$refs.mapContainer) {
				await this.$nextTick();
			}
			if (!this.$refs.mapContainer || this.map !== null || !this.showMap) {
				return false;
			}
			// Only use the L for leaflet temporarily and release it later again
			let oldL = window.L;
			try {
				this.map = {
					leaflet: null,
					instance: null,
					geometries: null
				};
				// Leaflet no conflict fix: Try to re-use an already available instance of Leaflet to avoid
				// conflicts with other libraries such as ipyleaflet. Also, use L variable as long as initMap
				// is running. For all other cases store Leaflet in this.map.leaflet, which can be used in other places.
				let hasLeaflet = () => Utils.isObject(window.L) && Versions.validate(window.L.version) && Versions.compare(window.L.version, "1.x.x", "=");
				if (!hasLeaflet()) {
					window.L = require('leaflet');
				}
				if (!hasLeaflet()) {
					console.warn("Leaflet is not available");
					return false;
				}
				this.map.leaflet = window.L;

				let css = await import('leaflet/dist/leaflet.css');
				// In Web Component mode inject the CSS into the shadowroot
				if (this.$root && this.$root.$options.shadowRoot && css.__inject__) {
					css.__inject__(this.$root.$options.shadowRoot);
				}

				var map = this.map.leaflet.map(this.$refs.mapContainer, {scrollWheelZoom: this.leafletOptions.scrollWheelZoom});
				this.map.instance = map;
				var osm = this.map.leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					name: 'OpenStreetMap',
					attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
					noWrap: this.leafletOptions.noWrap
				});
				osm.addTo(map);

				if (typeof this.addFeatures === 'function') {
					this.map.geometries = this.addFeatures();
					if (this.map.geometries) {
						this.map.geometries.addTo(map);
					}
				}

				// Update map container in DOM
				this.$refs.mapContainer.style.width = this.leafletOptions.width;
				this.$refs.mapContainer.style.height = this.leafletOptions.height;
				map.invalidateSize(false);
				this.updateMapView();

				if (typeof this.mapOptions.onAfterMapInit === 'function') {
					typeof this.mapOptions.onAfterMapInit(map, this.map.geometries);
				}
				// Leaflet no conflict fix: Release L global variable again
				window.L = oldL;
				return true;
			} catch (e) {
				console.error(e);
				// Leaflet no conflict fix: Release L global variable again
				window.L = oldL;
				return false;
			}
		},
		updateMapView() {
			if (!this.map || !this.map.geometries) {
				return;
			}

			// Compute somewhat smart map extent and zoom level around bbox
			var bounds = this.map.geometries.getBounds();
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
		}
	}
};