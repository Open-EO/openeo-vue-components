<template>
	<div class="vue-component service-types">
		<SearchableList :data="services" summaryKey="title" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<ServiceType :id="slot.summary.identifier" :service="slot.item">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="service-type-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="service-type-end" v-bind="scope" /></template>
				</ServiceType>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils.js';

export default Utils.enableHtmlProps({
	name: 'ServiceTypes',
	components: {
		SearchableList: () => Utils.loadAsyncComponent(import('./SearchableList.vue')),
		ServiceType: () => Utils.loadAsyncComponent(import('./ServiceType.vue'))
	},
	props: {
		services: {
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
			default: 'Secondary Web Services'
		},
		collapsed: {
			type: Boolean,
			default: null
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>