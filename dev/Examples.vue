<template>
	<div class="container">
		<h1>Examples</h1>
		<div class="compomnent" v-for="(examples, component) in data" :key="component">
			<h2>{{ component }}</h2>
			<div class="example" v-for="(props, id) in examples" :key="id">
				<h3>Example: {{ id }}</h3>
				<div v-if="show[component + id]">
					<button @click="load(component, id, false)" type="button">Remove Component</button>
					<div class="rendered">
						<component :is="component" v-bind="props"></component>
					</div>
				</div>
				<button v-else @click="load(component, id)" type="button">Load Component</button>
			</div>
		</div>
	</div>
</template>

<script>
import EXAMPLES from './examples';

import BillingPlans from '../components/BillingPlans.vue';
import Capabilities from '../components/Capabilities.vue';
import Collection from '../components/Collection.vue';
import Collections from '../components/Collections.vue';
import DeprecationNotice from '../components/DeprecationNotice.vue';
import Description from '../components/Description.vue';
import ExperimentalNotice from '../components/ExperimentalNotice.vue';
import FileFormats from '../components/FileFormats.vue';
import JsonSchema from '../components/JsonSchema.vue';
import LinkList from '../components/LinkList.vue';
import ObjectTree from '../components/ObjectTree.vue';
import Process from '../components/Process.vue';
import Processes from '../components/Processes.vue';
import ServiceTypes from '../components/ServiceTypes.vue';
import SupportedFeatures from '../components/SupportedFeatures.vue';
import Tab from '../components/Tab.vue';
import Tabs from '../components/Tabs.vue';
import UdfRuntime from '../components/UdfRuntime.vue';
import UdfRuntimes from '../components/UdfRuntimes.vue';

export default {
	name: 'Examples',
	components: {
		BillingPlans,
		Capabilities,
		Collection,
		Collections,
		DeprecationNotice,
		Description,
		ExperimentalNotice,
		FileFormats,
		JsonSchema,
		LinkList,
		ObjectTree,
		Process,
		Processes,
		ServiceTypes,
		SupportedFeatures,
		Tab,
		Tabs,
		UdfRuntime,
		UdfRuntimes
	},
	data() {
		return {
			data: EXAMPLES,
			show: {}
		};
	},
	methods: {
		load(component, id, show = true) {
			this.$set(this.show, component + id, show);
		}
	}
}
</script>

<style>
@import url('./examples.css');
</style>

<style scoped>
.rendered {
	margin: 1em 0;
	border: 1px solid white;
	outline: 1px solid black;
}
</style>