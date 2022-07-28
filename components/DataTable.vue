<template>
	<div class="vue-component data-table">
		<div class="menu">
			<div class="toolbar">
				<slot name="toolbar"></slot>
			</div>
			<div class="filter" v-if="hasData">
				<SearchBox v-model="filterValue" :compact="true" />
			</div>
		</div>
		<table v-if="hasData">
			<thead>
				<tr>
					<th v-for="(col, id) in columns" v-show="!col.hide" :key="col.name" :class="thClasses(id)" @click="enableSort(id)" :title="thTitle(id)">{{ col.name }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, i) in view" :key="i">
					<td v-for="(col, id) in columns" v-show="!col.hide" :key="`${col.name}_${i}`" 
						:class="[id, {'edit': canEdit(col)}]"
						:title="canEdit(col) ? 'Double-click to change the value' : false"
						@dblclick="onDblClick($event, row, col, id)"
						:data-value="col.stylable ? value(row, col, id) : false">
						<slot :name="id" :row="row" :col="col" :id="id">
							<template v-if="showEditField(row, col, id)">
								<form @submit.prevent.stop="saveEditField($event, row, col, id)">
									<input type="text" ref="editField" :value="value(row, col, id)" @blur="saveEditField($event, row, col, id)" @keyup="resetEditFieldEsc($event, row, col, id)" />
								</form>
							</template>
							<span v-else v-html="formattedValue(row, col, id)" />
						</slot>
					</td>
				</tr>
				<tr v-if="hasData && view.length == 0" class="no-results">
					<td :colspan="columnCount">No element matches your search criteria.</td>
				</tr>
			</tbody>
		</table>
		<div class="no-data" v-else>{{ noDataMessage }}</div>
	</div>
</template>

<script>
import Utils from '../utils.js';
import { DataTypes, Formatters } from '@radiantearth/stac-fields';

export default {
	name: 'DataTable',
	components: {
		SearchBox: () => import('./SearchBox.vue')
	},
	props: {
		columns: {
			type: Object,
			default: () => ({})
		},
		data: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			view: [],
			filterValue: null,
			primaryKey: null,
			noDataMessage: 'No data available.',
			editField: null,
			sortState: {
				id: null,
				direction: null
			}
		};
	},
	watch: {
		data() {
			this.updateView();
		},
		filterValue() {
			this.updateView();
		},
		sortState() {
			this.updateView();
		},
		columns: {
			immediate: true,
			handler() {
				for(let id in this.columns) {
					let direction = this.columns[id].sort;
					if (['asc', 'desc'].includes(direction)) {
						this.enableSort(id, direction);
						break;
					}
				}
			}
		}
	},
	computed: {
		columnCount() {
			return Object.keys(this.columns).length;
		},
		hasData() {
			return this.data.length > 0;
		},
		hasFilter() {
			return (typeof this.filterValue === 'string' && this.filterValue.length > 0) ? true : false;
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	created() {
		this.determinePrimaryKey();
	},
	methods: {
		canEdit(col) {
			return (typeof col.edit === 'function');
		},
		showEditField(row, col, id) {
			return this.canEdit(col) && this.editField != null && this.editField[0] == row && this.editField[1] == id;
		},
		onDblClick(event, row, col, id) {
			if (!this.canEdit(col)) {
				return;
			}

			var value = this.value(row, col, id);
			if (typeof value === 'boolean') {
				var action = this.columns[id].edit;
				action(row);
			}
			else {
				this.editField = [row, id];
				this.$nextTick(() => this.$refs.editField[0].focus());
			}
			event.preventDefault();
			event.stopPropagation();
		},
		saveEditField(event, row, col, id) {
			if (this.editField !== null && this.canEdit(col)) {
				var action = this.columns[id].edit;
				action(row, this.$refs.editField[0].value);

				this.editField = null;
				event.preventDefault();
				event.stopPropagation();
			}
		},
		resetEditFieldEsc(event, row, col, id) {
			if (event.key == "Escape") {
				this.editField = null;
			}
		},
		determinePrimaryKey() {
			for(var col in this.columns) {
				if (this.columns[col].primaryKey) {
					this.primaryKey = col;
					break;
				}
			}
		},
		setNoData(error) {
			if (typeof error == 'string') {
				this.noDataMessage = error;
				return;
			}
			else if (Utils.isObject(error)) {
				if (typeof error.data === 'object' && typeof error.config === 'object' && typeof error.headers === 'object') {
					// Axios response, handle the data only.
					error = error.data;
				}
				if (Utils.isObject(error) && typeof error.message === 'string') {
					this.noDataMessage = error.message;
					return;
				}
			}
			console.warn(error);
			this.noDataMessage = "Sorry, an unknown error has occured.";
		},
		value(row, col, id) {
			var data;
			if (typeof row === 'object') {
				data = row[id];
			}
			else {
				data = row;
			}
			if (Utils.isObject(col) && typeof col.computedValue === 'function') {
				data = col.computedValue(row, data);
			}
			return data;
		},
		formattedValue(row, col, id) {
			return this.format(this.value(row, col, id), col);
		},
		thClasses(id) {
			let col = this.columns[id];
			let classes = [id];
			if (col.sort !== false) {
				classes.push('sortable');
				if (this.sortState.id === id) {
					classes.push('sort-' + this.sortState.direction);
				}
			}
			return classes;
		},
		thTitle(id) {
			let col = this.columns[id];
			if (col.sort !== false) {
				if (this.sortState.id === id && this.sortState.direction === 'asc') {
					return "Click to sort column in descending order";
				}
				else {
					return "Click to sort column in ascending order";
				}
			}
			return null;
		},
		enableSort(id, direction = null) {
			if (this.columns[id].sort === false) {
				return;
			}
			if (direction === null) {
				direction = this.sortState.id === id && this.sortState.direction === 'asc' ? 'desc' : 'asc';
			}
			this.sortState = {id, direction};
		},
		sort(data) {
			let colId = this.sortState.id;
			if (colId === null || !this.columns[colId]) {
				return data;
			}
			let col = this.columns[colId];
			if (col.sort === false) {
				return data;
			}

			return data.slice(0).sort((a,b) => {
				let fn = typeof col.sortFn === 'function' ? col.sortFn : Utils.compareStringCaseInsensitive;
				let result = fn(a[colId], b[colId]);
				return this.sortState.direction === 'desc' ? result * -1 : result;
			});
		},
		filter(data) {
			if (!this.hasFilter) {
				return data;
			}
			var searchTerm = this.filterValue.toLowerCase();

			return data.filter(row => {
				let values = [];
				for(var key in row) {
					var col = this.columns[key];
					if (typeof col === 'undefined' || col.hasOwnProperty('filterable') && col.filterable === false) {
						continue;
					}
					var value = this.value(row, col, key);
					if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
						value = value.toString();
					}
					else {
						continue;
					}
					values.push(value);
				}
				return Utils.search(searchTerm, values);
			});
		},
		clearFilter() {
			this.filterValue = '';
			this.updateView();
		},
		updateView() {
			if (!Array.isArray(this.data)) {
				this.view = [];
				return;
			}
			this.view = this.sort(this.filter(this.data));
		},
		format(value, col) {
			if (typeof col.format === 'string') {
				if (typeof Formatters['format' + col.format] === 'function') {
					return Formatters['format' + col.format](value, col);
				}
				else {
					console.warn(col.format + ' is an invalid formatter.');
				}
			}
			else if (typeof col.format === 'function') {
				return col.format.call(this, value, col);
			}
			else {
				return DataTypes.format(value);
			}
		}
	}
}
</script>

<style lang="scss">
.vue-component.data-table {
	table {
		width: 100%;
		border-collapse: collapse;
		td, th {
			border: 1px solid #ddd;
			padding: 0.2em;
		}
		th {
			text-align: left !important;
			
			&.sortable {
				cursor: pointer;

				&:hover {
					background-color: #eee;
				}
			}
			&.sort-asc:after,
			&.sortable:after {
				visibility: hidden;
				margin-left: 5px;
				font-weight: 100;
				content: "⇑";
			}
			&.sort-asc:after,
			&.sortable:hover:after {
				visibility: visible;
			}
			&.sort-desc:after {
				visibility: visible;
				margin-left: 5px;
				font-weight: 100;
				content: "⇓";
			}
			&.sort-asc:hover:after,
			&.sort-desc:hover:after {
				visibility: visible;
				margin-left: 5px;
				font-weight: 100;
				content: "⇕";
			}
		}
	}
	.filter-icon {
		margin-right: 3px;
	}
	.no-results td {
		text-align: center;
	}
	.menu {
		margin-bottom: 5px;
		display: flex;
		justify-content: space-between;
	}
	.filter {
		flex-grow: 1;
		text-align: right;
		padding-left: 1em;
		min-width: 4em;
		max-width: 20em;
		.edit {
			cursor: pointer;
		}
	}
}
</style>