<template>
	<div class="vue-component collections">
		<SearchableList ref="list" :data="collections" identfierKey="id" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<Collection :collection="slot.item" :mapOptions="mapOptions">
					<template #title><span class="hidden" /></template>
					<template #before-description><slot name="collection-before-description" /></template>
					<template #end><slot name="collection-end" /></template>
					<template #spatial-extents="scope"><slot name="collection-spatial-extents" v-bind="scope" /></template>
					<template #temporal-extents="scope"><slot name="collection-temporal-extents" v-bind="scope" /></template>
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
			default: () => ({})
		},
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
			default: 'Collections'
		},
		collapsed: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		toggleHeading(show = null) {
			if (this.$refs.list) {
				this.$refs.list.toggleHeading(show);
			}
		}
	}
})
</script>
