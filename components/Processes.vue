<template>
	<div class="vue-component processes">
		<SearchableList :data="processes" :hideSummaryOnExpand="true" :externalSearchTerm="searchTerm" :sort="sort" :allowExpand="allowExpand">
			<template v-slot:details="slot">
				<Process :process="slot.item" :provideDownload="provideDownload" :processUrl="processUrl">
					<template v-slot:title><span class="hidden" /></template>
				</Process>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import SearchableList from './internal/SearchableList.vue';
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Processes',
	components: {
		Process: () => import('./Process.vue'),
		SearchableList
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
		}
	}
})
</script>
