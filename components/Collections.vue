<template>
	<div class="vue-component collections">
		<SearchableList :data="collections" identifierKey="id" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed" :mapOptions="mapOptions">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<Collection :data="slot.item" :mapOptions="mapOptions">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="collection-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="collection-end" v-bind="scope" /></template>
					<template #spatial-extents="scope"><slot name="collection-spatial-extents" v-bind="scope" /></template>
					<template #temporal-extents="scope"><slot name="collection-temporal-extents" v-bind="scope" /></template>
				</Collection>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';

export default {
	name: 'Collections',
	components: {
		Collection: () => Utils.loadAsyncComponent(import('./Collection.vue')),
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue'))
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
			default: null
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>
