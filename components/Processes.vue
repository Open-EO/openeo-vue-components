<template>
	<div class="vue-component processes">
		<SearchableList :data="processes" :showSummaryOnExpand="false" :externalSearchTerm="searchTerm" :sort="sort" :allowExpand="allowExpand" :heading="heading">
			<template #details="slot">
				<Process :process="slot.item" :provideDownload="provideDownload" :processUrl="processUrl">
					<template #title><span class="hidden" /></template>
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
		Process: () => import('./Process.vue'),
		SearchableList: () => import('./SearchableList.vue')
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
		allowExpand: {
			type: Boolean,
			default: true
		},
		heading: {
			type: String,
			default: 'Processes'
		}
	}
})
</script>
