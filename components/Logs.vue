<template>
	<div class="vue-component logs">
		<div class="log-container" v-if="hasLogs">
			<div class="log-header">
				<div class="log-search">
					<SearchBox  v-if="externalSearchTerm === null" v-model="searchTerm" placeholder="Search in Logs" :minLength="2" />
					<MultiSelect v-model="fields" :options="availableFields" trackBy="id" label="label"
						:multiple="true" :searchable="false" :allowEmpty="false" :closeOnSelect="false"
						:limit="3" :limitText="count => `+ ${count}`"
						selectedLabel="✓" deselectLabel="␡" selectLabel="+"
						title="Select the log levels shown in the list of logs"></MultiSelect>
				</div>
				<MultiSelect class="log-levels" v-model="levelsShown" :options="levels"
					:multiple="true" :searchable="false" :allowEmpty="false" :closeOnSelect="false"
					selectedLabel="✓" deselectLabel="␡" selectLabel="+"
					title="Select the log levels shown in the list of logs">
					<template slot="tag" slot-scope="props">
						<span class="multiselect__tag" :class="props.option" :key="props.index">
							<span v-text="props.option"></span>
							<i tabindex="1" @keypress.enter.prevent="props.remove(props.option)" @mousedown.prevent="props.remove(props.option)" class="multiselect__tag-icon"></i>
						</span>
					</template>
				</MultiSelect>
			</div>
			<ul class="log-body">
				<Log v-for="(log, i) in logs" v-show="shown[i]" :log="log" :startTime="startTime" :key="log.id" />
			</ul>
		</div>
		<div v-else class="log-empty">No logs available.</div>
	</div>
</template>

<script>
import Utils from '../utils';
import Log from './internal/Log.vue';

export default {
	name: 'Logs',
	components: {
		Log,
		MultiSelect: () => import('vue-multiselect'),
		SearchBox: () => import('./SearchBox.vue')
	},
	props: {
		logs: {
			type: Array,
			default: () => ([])
		},
		externalSearchTerm: {
			type: String,
			default: null
		}
	},
	data() {
		let levels = [
			'debug',
			'info',
			'warning',
			'error'
		];
		let fields = [
			{id: "id", label: "ID"},
			{id: "code", label: "Code", default: true},
			{id: "level", label: "Level"},
			{id: "message", label: "Message", default: true},
			{id: "time", label: "Date and Time"},
			{id: "data", label: "Data", default: true},
			{id: "path", label: "Path"},
			{id: "usage", label: "Usage Metrics"},
			{id: "links", label: "Related Resources"}
		];
		return {
			levels: levels,
			levelsShown: levels,
			searchTerm: '',
			availableFields: fields,
			fields: fields.filter(field => Boolean(field.default))
		};
	},
	computed: {
		shown() {
			return this.logs.map(log => {
				if (!this.levelsShown.includes(log.level)) {
					return false;
				}
				if (this.searchTerm.length >= 2) {
					if (this.fields.length != this.availableFields.length) {
						let fields = this.fields.map(field => field.id);
						log = Utils.pickFromObject(log, fields);
					}
					return Utils.search(this.searchTerm, log);
				}
				return true;
			});
		},
		startTime() {
			if (this.hasLogs) {
				let startTime = this.logs.find(log => Utils.isObject(log) && typeof log.time === 'string' && log.time.length > 10);
				if (Utils.isObject(startTime) && startTime.time) {
					return startTime.time;
				}
			}
			return null;
		},
		hasLogs() {
			return Array.isArray(this.logs) && this.logs.length > 0;
		}
	},
	watch: {
		externalSearchTerm: {
			immediate: true,
			handler(value) {
				this.searchTerm = typeof value === 'string' ? value : '';
			}
		},
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
@import './base.scss';

.vue-component.logs {

	.log-viewer,
	.log-container {
		width: 100%;
		height: 100%;
		max-height: 100vh;
	}
	.log-header {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: white;
		z-index: 1;

		.log-levels {
			.multiselect__tag {
				text-transform: uppercase;
			}
		}

		.log-search {
			display: flex;
			align-items: stretch;
			margin-bottom: 0.25em;
			gap: 0.25em;

			.multiselect {
				flex-grow: 1;
				max-width: 22em;
			}

			.search-box {
				width: 100%;
				flex-grow: 1;
				margin-bottom: 0;

				input {
					height: 100%;
					border: 1px solid #e8e8e8;
    				border-radius: 5px;
				}
			}
		}
	}
	.log-body {
		list-style-type: none;
		margin: 0;
		padding: 0;
		line-height: 1.25em;
	}
	.log-empty {
		text-align: center;
	}

	.badges {
		white-space: nowrap;

		.badge {
			margin-top: 0;
			margin-bottom: 0;
		}

		.time {
			border: 1px solid #e0e0e0;
			background-color: #f0f0f0;
			color: #818182;
			text-transform: none;
		}
	}

	.badges .info,
	.multiselect__tag.info {
		border: 1px solid #383d41;
		background-color: #e2e3e5;
		color: #383d41;
	}
	.log-entry.info .log-message {
		color: #383d41;
	}

	.badges .debug,
	.multiselect__tag.debug {
		border: 1px solid #818182;
		background-color: #fefefe;
		color: #818182;
	}
	.log-entry.debug .log-message {
		color: #818182;
	}

	.badges .warning,
	.multiselect__tag.warning {
		border: 1px solid #856404;
		background-color: #fff3cd;
		color: #856404;
	}
	.log-entry.warning .log-message {
		color: #856404;
	}

	.badges .error,
	.multiselect__tag.error {
		border: 1px solid #721c24;
		background-color: #f8d7da;
		color: #721c24;
	}
	.log-entry.error .log-message {
		color: #721c24;
	}

	.multiselect__tag-icon {
		&:after {
			color: inherit;
		}
		&:focus,
		&:hover {
			background-color: rgba(0,0,0,0.2);
			color: black;
		}
	}
}
</style>