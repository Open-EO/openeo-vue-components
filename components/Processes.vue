<template>
	<div class="vue-component processes">
		<SearchableList :data="processes" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :offerDetails="offerDetails" :heading="heading" :collapsed="collapsed">
			<template #heading="scope"><slot name="heading" v-bind="scope" /></template>
			<template #summary="scope"><slot name="summary" v-bind="scope" /></template>
			<template #details="slot">
				<Process :process="slot.item" :provideDownload="provideDownload" :processUrl="processUrl">
					<template #title><span class="hidden" /></template>
					<template #before-description="scope"><slot name="process-before-description" v-bind="scope" /></template>
					<template #end="scope"><slot name="process-end" v-bind="scope" /></template>
				</Process>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Processes',
	components: {
		Process: () => Utils.loadAsyncComponent(import(/* webpackChunkName: "process" */'./Process.vue')),
		SearchableList: () => Utils.loadAsyncComponent(import(/* webpackChunkName: "searchable-list" */'./SearchableList.vue'))
	},
	props: {
		processes: {
			type: Array,
			default: () => ([])
		},
		provideDownload: {
			type: Boolean,
			default: true
		},
		processUrl: String,
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
			default: 'Processes'
		},
		collapsed: {
			type: Boolean,
			default: null
		}
	}
})
</script>
