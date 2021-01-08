<template>
	<div>
		<table v-if="stac.isTable(value)" class="table">
			<thead>
				<tr>
					<th v-if="!Array.isArray(value.data)">&nbsp;</th>
					<th v-for="(key, i) in value.header" :key="i">{{ stac.formatKey(key, field) }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, rowname) in value.data" :key="rowname">
					<th v-if="!Array.isArray(value.data)">{{ rowname }}</th>
					<td v-for="(key, i) in value.header" :key="i">
						<CollectionSummary :value="row[key]" :field="key" :parent="field" />
					</td>
				</tr>
			</tbody>
		</table>
		<a v-else-if="stac.isLink(value)" :href="value.href" target="_blank">{{ value.title }}</a>
		<ObjectTree v-else-if="stac.isObject(value)" :data="value" />
		<Description v-else-if="stac.isDescription(field, parent)" :description="value" :compact="true" />
		<template v-else>{{ stac.formatValue(value, field, parent) }}</template>
	</div>
</template>

<script>
import Description from '../Description.vue';
import ObjectTree from '../ObjectTree.vue';
import StacCollectionUtils from '../../stacutils';
import '../base.css';

export default {
	name: 'CollectionSummary',
	components: {
		Description,
		ObjectTree
	},
	props: {
		value: {},
		field: String,
		parent: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			stac: StacCollectionUtils
		};
	}
};
</script>

<style scoped>
.table {
	width: 100%;
	border-collapse: collapse;
}
.table th {
	text-align: left;
	background-color: #eee;
}
.table td, .table th {
	border: 1px solid #ccc;
	padding: 3px;
}
.table td {
	vertical-align: top;
}
.table tr:hover {
	background-color: #f9f9f9;
}
</style>