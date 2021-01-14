<template>
	<div class="vue-component processes">
		<SearchableList :data="processes" :hideSummary="true">
			<template v-slot:details="slot">
				<Process :process="slot.item" :provideDownload="provideDownload" :processUrl="processUrl">
					<template v-slot:title><span class="hidden" /></template>
				</Process>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Process from './Process.vue';
import SearchableList from './internal/SearchableList.vue';
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Processes',
	components: {
		Process,
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
		processUrl: String
	}
})
</script>
