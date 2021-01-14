<template>
	<div class="vue-component collections">
		<SearchableList :data="collections" identfierKey="id" summaryKey="title" :hideSummaryOnExpand="true" :externalSearchTerm="searchTerm" :sort="sort" :allowExpand="allowExpand">
			<template v-slot:details="slot">
				<Collection :collection="slot.item" :mapOptions="mapOptions">
					<template v-slot:title><span class="hidden" /></template>
				</Collection>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import SearchableList from './internal/SearchableList.vue';
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Collections',
	components: {
		Collection: () => import('./Collection.vue'),
		SearchableList
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
		}
	}
})
</script>
