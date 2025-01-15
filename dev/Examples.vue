<template>
	<div class="container">
		<h1>Examples</h1>
		<div class="container" v-for="(examples, component) in data" :key="component">
			<h2>{{ component }}</h2>
			<div class="example" v-for="(props, id) in examples" :key="id">
				<h3>
					➥ {{ id }}
					<button @click="toggle(component, id)" type="button">
						<template v-if="show[component + id]">Remove Component</template>
						<template v-else>Load Component</template>
					</button>
				</h3>
				<div class="component" v-if="show[component + id]">
					<component :is="component" v-bind="props"></component>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import EXAMPLES from './examples';

import BButton from '../components/internal/BButton.vue';
import BillingPlans from '../components/BillingPlans.vue';
import Capabilities from '../components/Capabilities.vue';
import Collection from '../components/Collection.vue';
import Collections from '../components/Collections.vue';
import DataTable from '../components/DataTable.vue';
import DeprecationNotice from '../components/DeprecationNotice.vue';
import Description from '../components/Description.vue';
import ExperimentalNotice from '../components/ExperimentalNotice.vue';
import FederationMissingNotice from '../components/FederationMissingNotice.vue';
import FileFormat from '../components/FileFormat.vue';
import FileFormats from '../components/FileFormats.vue';
import Item from '../components/Item.vue';
import Items from '../components/Items.vue';
import Job from '../components/Job.vue';
import JobEstimate from '../components/JobEstimate.vue';
import JsonSchema from '../components/JsonSchema.vue';
import LinkList from '../components/LinkList.vue';
import Logs from '../components/Logs.vue';
import ModelBuilder from '../components/ModelBuilder.vue';
import ObjectTree from '../components/ObjectTree.vue';
import Process from '../components/Process.vue';
import Processes from '../components/Processes.vue';
import SearchableList from '../components/SearchableList.vue';
import Service from '../components/Service.vue';
import ServiceType from '../components/ServiceType.vue';
import ServiceTypes from '../components/ServiceTypes.vue';
import SupportedFeatures from '../components/SupportedFeatures.vue';
import Tab from '../components/Tab.vue';
import Tabs from '../components/Tabs.vue';
import UdfRuntime from '../components/UdfRuntime.vue';
import UdfRuntimes from '../components/UdfRuntimes.vue';

export default {
	name: 'Examples',
	components: {
		BButton,
		BillingPlans,
		Capabilities,
		Collection,
		Collections,
		DataTable,
		DeprecationNotice,
		Description,
		ExperimentalNotice,
		FederationMissingNotice,
		FileFormat,
		FileFormats,
		Item,
		Items,
		Job,
		JobEstimate,
		JsonSchema,
		LinkList,
		Logs,
		ModelBuilder,
		ObjectTree,
		Process,
		Processes,
		SearchableList,
		Service,
		ServiceType,
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
		toggle(component, id) {
			let key = component + id;
			this.$set(this.show, key, !this.show[key]);
		}
	}
}
</script>

<style>
@import url('./examples.css');

.component > .model-builder {
	height: 400px;
}
</style>