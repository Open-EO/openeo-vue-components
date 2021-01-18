<template>
	<div class="vue-component collections">
		<SearchableList :data="collections" identfierKey="id" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :allowExpand="allowExpand" :heading="heading">
			<template v-slot:details="slot">
				<Collection :collection="slot.item" :mapOptions="mapOptions">
					<template v-slot:title><span class="hidden" /></template>
				</Collection>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Collections',
	components: {
		Collection: () => import('./Collection.vue'),
		SearchableList: () => import('./SearchableList.vue')
	},
	props: {
		collections: {
			type: Array,
			default: () => ([])
		},
		mapOptions: {
			type: Object,
			default: () => ({
				scrollWheelZoom: false
			})
		},
		searchTerm: {
			type: String,
			default: null
		},
		sort: {
			type: Boolean,
			default: true
		},
		allowExpand: {
			type: Boolean,
			default: true
		},
		heading: {
			type: String,
			default: 'Collections'
		}
	}
})
</script>
