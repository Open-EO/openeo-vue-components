<template>
	<div class="vue-component collections">
		<SearchableList :data="collections" identfierKey="id" summaryKey="title" :hideSummary="true">
			<template v-slot:details="slot">
				<Collection :collection="slot.item" :mapOptions="mapOptions">
					<template v-slot:title><span class="hidden" /></template>
				</Collection>
			</template>
		</SearchableList>
	</div>
</template>

<script>
import Collection from './Collection.vue';
import SearchableList from './internal/SearchableList.vue';
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'Collections',
	components: {
		Collection,
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
		}
	}
})
</script>
