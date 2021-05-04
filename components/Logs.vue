<template>
	<div class="vue-component logs">
		<div class="log-container" v-if="Array.isArray(logs) && logs.length">
			<div class="log-header">
				<MultiSelect v-model="levelsShown" :multiple="true" :options="levels" :allowEmpty="false" :taggable="true" :closeOnSelect="false" placeholder="Select the log levels shown" />
			</div>
			<ul class="log-body">
				<Log v-for="(log, i) in logs" v-show="levelsShown.includes(log.level)" :log="log" :key="i" />
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
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>