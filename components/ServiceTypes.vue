<template>
	<div class="vue-component service-types">
		<SearchableList :data="services" summaryKey="title" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="slot">
				<strong>{{ slot.summary.identifier }}</strong>
				<small>{{ slot.summary.summary }}</small>
			</template>
			<template #details="slot">
				<ServiceType :id="slot.summary.identifier" :service="slot.item">
					<template #title><span class="hidden" /></template>
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
		SearchableList: () => import('./SearchableList.vue'),
		ServiceType: () => import('./ServiceType.vue')
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
			default: false
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>