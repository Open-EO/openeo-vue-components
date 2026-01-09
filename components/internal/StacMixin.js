import Utils from '../../utils';
import StacMigrate from '@radiantearth/stac-migrate';
import MapMixin from './MapMixin';
import StacLinksMixin from './StacLinksMixin';

const IMAGE_MEDIA_TYPES = ['image/apng', 'image/gif', 'image/png', 'image/jpeg', 'image/webp'];
const IMAGE_EXTENSIONS = ['gif', 'png', 'jpg', 'jpeg', 'webp'];

export default {
	mixins: [
		MapMixin,
		StacLinksMixin
	],
	components: {
		Description: () => import('../Description.vue'),
		DeprecationNotice: () => import('../DeprecationNotice.vue'),
		LinkList: () => import('../LinkList.vue'),
		StacAsset: () => import('../internal/StacAsset.vue'),
		StacFields: () => import('../internal/StacFields.vue')
	},
	props: {
		data: {
			type: Object,
			default: () => ({})
		},
		onStacNavigation: {
			type: Function,
			default: null
		}
	},
	computed: {
		stac() {
			let cloned = Utils.deepClone(this.data);
			return StacMigrate.stac(cloned);
		},
		thumbnails() {
			if (!Utils.isObject(this.stac.assets)) {
				return [];
			}
			return Object.values(this.stac.assets).filter(this.assetIsImage);
		},
		hasAssets() {
			return Utils.size(this.stac.assets) > 0;
		},
		selfUrl() {
			return this.getStacLinkByRel(this.stac.links, 'self')?.href || null;
		},
		derivedFromLinks() {
			return this.getStacLinksByRels(this.stac.links, ['derived_from'], true);
		},
		relatedLinks() {
			return this.getStacLinksByRels(this.stac.links, ['related'], true);
		},
		isItem() {
			return Utils.isObject(this.stac) && this.stac.type === 'Feature' && Utils.isObject(this.stac.properties);
		}
	},
	watch: {
		data() {
			this.initMap();
		}
	},
	methods: {
		assetIsImage(asset) {
			let ext = typeof asset.href === 'string' ? asset.href.split('.').pop() : '';
			return Array.isArray(asset.roles) && 
				(asset.roles.includes('thumbnail') || asset.roles.includes('overview')) && 
				(IMAGE_MEDIA_TYPES.includes(asset.type) || IMAGE_EXTENSIONS.includes(ext));
		}
	}
};