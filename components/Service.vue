<template>
	<article class="vue-component service">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="service.id"></a>
			<h2>{{ service.title || service.id }}</h2>
		</slot>

		<section class="basedata">
			<div class="tabular">
				<label>ID:</label>
				<code class="value">{{ service.id }}</code>
			</div>

			<div class="tabular">
				<label>Type:</label>
				<span class="value">{{ type }}</span>
			</div>

			<div class="tabular" v-if="service.url">
				<label>URL:</label>
				<code class="value">
					<a :href="service.url" target="_blank">{{ service.url }}</a>
				</code>
			</div>

			<div class="tabular">
				<label>Enabled:</label>
				<span class="value boolean">
					<span v-if="service.enabled === true">✔️</span>
					<span v-else-if="service.enabled === false">❌</span>
					<span v-else>❓</span>
				</span>
			</div>

			<div class="tabular" v-if="service.created">
				<label>Created:</label>
				<span class="value">{{ created }}</span>
			</div>
		</section>

		<slot name="before-description" v-bind="$props"></slot>

		<summary class="description" v-if="service.description">
			<h3>Description</h3>
			<Description :description="service.description" />
		</summary>

		<section class="attributes" v-if="hasAttributes">
			<h3>Exposed Capabilities from {{ type }}</h3>
			<div class="tabular" v-for="(value, key) in service.attributes" :key="key">
				<label>{{ key | prettifyKey }}:</label>
				<ObjectTree class="value" :data="value" />
			</div>
		</section>

		<section class="parameters" v-if="hasConfig">
			<h3>Custom Settings for {{ type }}</h3>
			<div class="tabular" v-for="(value, key) in service.configuration" :key="key">
				<label>{{ key | prettifyKey }}:</label>
				<ObjectTree class="value" :data="value" />
			</div>
		</section>

		<section class="billing" v-if="service.plan || costs || budget">
			<h3>Billing</h3>
			<div class="tabular" v-if="service.plan">
				<label>Billing plan:</label>
				<span class="value">{{ service.plan }}</span>
			</div>

			<div class="tabular" v-if="costs">
				<label>Incurred Costs:</label>
				<span class="value">{{ costs }}</span>
			</div>

			<div class="tabular" v-if="budget">
				<label title="The allowed maximum costs, specified by the user.">Budget limit:</label>
				<span class="value">{{ budget }}</span>
			</div>
		</section>

		<section class="usage" v-if="hasUsageMetrics">
			<h3>Usage Metrics</h3>
			<div v-for="(metric, key) in usage" :key="key" class="tabular">
				<label class="metric">{{ key | usageLabel }}</label>
				<span class="value">{{ metric.value | usageValue }} <span class="unit">{{ metric.unit }}</span></span>
			</div>
		</section>

		<section class="process">
			<h3>Process</h3>
			<Process class="inline" :process="service.process" :provideDownload="false" :showGraph="true">
				<template #process-graph="p"><slot name="process-graph" :v-bind="p" /></template>
			</Process>
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import Utils from '../utils';
import UsageMixin from './internal/UsageMixin.js';

export default {
	name: 'Service',
	mixins: [
		UsageMixin
	],
	components: {
		Description: () => import('./Description.vue'),
		ObjectTree: () => import('./ObjectTree.vue'),
		Process: () => import('./Process.vue')
	},
	props: {
		service: {
			type: Object,
			default: () => ({})
		},
		currency: {
			type: String,
			default: null
		}
	},
	computed: {
		budget() {
			return Utils.formatBudget(this.service.budget, this.currency, "No limit specified");
		},
		costs() {
			return Utils.formatCurrency(this.service.costs, this.currency);
		},
		created() {
			return Utils.formatTimestamp(this.service.created);
		},
		hasAttributes() {
			return Utils.size(this.service.attributes) > 0;
		},
		hasConfig() {
			return Utils.size(this.service.configuration) > 0;
		},
		type() {
			if (typeof this.service.type === 'string') {
				return this.service.type.toUpperCase();
			}
			else {
				return 'Unknown';
			}
		},
		usage() {
			return this.service.usage;
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	filters: {
		prettifyKey(key) {
			return Utils.prettifyString(key);
		}
	}
}
</script>

<style lang="scss">
@use './base.scss';
</style>