<template>
	<article class="vue-component service">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="service.id"></a>
			<h2>{{ title }}</h2>
		</slot>

		<slot name="before-description" v-bind="$props"></slot>

		<summary class="description" v-if="service.description">
			<Description :description="service.description" />
		</summary>

		<section class="basedata">
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
		</section>

		<section class="basedata">
			<h3>Status</h3>
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

			<template class="attributes" v-if="hasAttributes">
				<div class="tabular" v-for="(value, key) in service.attributes" :key="key">
					<label>{{ prettifyKey(key) }}:</label>
					<ObjectTree class="value" :data="value" />
				</div>
			</template>
		</section>

		<section class="parameters" v-if="hasConfig">
			<h3>Settings for {{ type }}</h3>
			<div class="tabular" v-for="(value, key) in service.configuration" :key="key">
				<label>{{ key }}:</label>
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
				<label>Costs:</label>
				<span class="value">{{ costs }}</span>
			</div>

			<div class="tabular" v-if="budget">
				<label>Budget:</label>
				<span class="value">{{ budget }}</span>
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

export default {
	name: 'Service',
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
			return Utils.formatBudget(this.service.budget, this.currency);
		},
		costs() {
			return Utils.formatCurrency(this.service.costs, this.currency);
		},
		title() {
			if (this.service.title) {
				return `${this.service.title} (${this.service.id})`;
			}
			else {
				return this.service.id;
			}
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
		}
	},
	methods: {
		prettifyKey(key) {
			return Utils.prettifyString(key);
		}
	}
}
</script>