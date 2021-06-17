<template>
	<div class="vue-component logs">
		<div class="log-container" v-if="Array.isArray(logs) && logs.length">
			<div class="log-header">
				<MultiSelect v-model="levelsShown" :multiple="true" :options="levels" :allowEmpty="false" :taggable="true" :closeOnSelect="false" placeholder="Select the log levels shown">
					<template slot="tag" slot-scope="props">
						<span class="multiselect__tag" :class="props.option" :key="props.index">
							<span v-text="props.option"></span>
							<i tabindex="1" @keypress.enter.prevent="props.remove(props.option)" @mousedown.prevent="props.remove(props.option)" class="multiselect__tag-icon"></i>
						</span>
					</template>
				</MultiSelect>
			</div>
			<ul class="log-body">
				<Log v-for="(log, i) in logs" v-show="levelsShown.includes(log.level)" :log="log" :startTime="startTime" :key="i" />
			</ul>
		</div>
		<div v-else-if="Array.isArray(logs) && !logs.length" class="noDataMessage">No logs available.</div>
		<div v-else class="noDataMessage"><i class="fas fa-spinner fa-spin"></i> Loading logs...</div>
	</div>
</template>

<script>
import Utils from '../utils';
import Log from './internal/Log.vue';

export default {
	name: 'Logs',
	components: {
		Log,
		MultiSelect: () => import('vue-multiselect')
	},
	props: {
		logs: {
			type: Array,
			default: () => ([])
		}
	},
	computed: {
		startTime() {
			if (Array.isArray(this.logs)) {
				return this.logs.find(log => typeof log.time === 'string' && log.time.length > 10).time || null;
			}
			return null;
		}
	},
	data() {
		let levels = [
			'debug',
			'info',
			'warning',
			'error'
		];
		return {
			levels: levels,
			levelsShown: levels
		};
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
};
</script>

<style scoped>
.log-viewer, .log-container {
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
}
.log-body {
	list-style-type: none;
	margin: 0;
	padding: 0;
	line-height: 1.25em;
}
</style>

<style>
@import url('./base.css');

.vue-component.logs .badges {
	white-space: nowrap;
}
.vue-component.logs .badges .badge {
	margin-top: 0;
	margin-bottom: 0;
}
.vue-component.logs .badges .info, .vue-component.logs .multiselect__tag.info {
	border: 1px solid #383d41;
	background-color: #e2e3e5;
	color: #383d41;
}
.vue-component.logs .log-entry.info .log-message {
	color: #383d41;
}
.vue-component.logs .badges .debug, .vue-component.logs .multiselect__tag.debug {
	border: 1px solid #818182;
	background-color: #fefefe;
	color: #818182;
}
.vue-component.logs .log-entry.debug .log-message {
	color: #818182;
}
.vue-component.logs .badges .warning, .vue-component.logs .multiselect__tag.warning {
	border: 1px solid #856404;
	background-color: #fff3cd;
	color: #856404;
}
.vue-component.logs .log-entry.warning .log-message {
	color: #856404;
}
.vue-component.logs .badges .error, .vue-component.logs .multiselect__tag.error {
	border: 1px solid #721c24;
	background-color: #f8d7da;
	color: #721c24;
}
.vue-component.logs .log-entry.error .log-message {
	color: #721c24;
}
.vue-component.logs .badges .time {
	border: 1px solid #e0e0e0;
	background-color: #f0f0f0;
	color: #818182;
	text-transform: none;
}
.vue-component.logs .log-header .multiselect__tag {
	text-transform: uppercase;
}
.vue-component.logs .multiselect__tag-icon:after {
	color: inherit;
}
.vue-component.logs .multiselect__tag-icon:focus, .vue-component.logs .multiselect__tag-icon:hover {
	background-color: rgba(0,0,0,0.2);
	color: black;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>