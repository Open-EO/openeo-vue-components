<template>
	<article class="vue-component job">

		<slot name="title" v-bind="$props">
			<a class="anchor" :name="job.id"></a>
			<h2>{{ job.title || job.id }}</h2>
		</slot>

		<section class="progress">
			<div class="tabular">
				<label>ID:</label>
				<code class="value">{{ job.id }}</code>
			</div>

			<div class="tabular">
				<label>Submitted:</label>
				<span class="value" v-html="created" />
			</div>

			<div class="tabular" v-if="updated">
				<label>Updated:</label>
				<span class="value" v-html="updated" />
			</div>

			<div class="tabular" v-if="job.status">
				<label>Status:</label>
				<span class="value status" :data-value="job.status">{{ job.status }}</span>
			</div>

			<div class="tabular" v-if="typeof job.progress === 'number'">
				<label>Progress:</label>
				<div class="value">
					<div class="progressBar" :class="{error: !!job.error}">
						<div class="completed" :style="'width: ' + progress">
							<span class="number" v-if="job.progress > 50">{{ progress }}</span>&nbsp;
						</div>
						<span class="number" v-if="job.progress <= 50">{{ progress }}</span>
					</div>
				</div>
			</div>

			<div class="tabular" v-if="job.log_level">
				<label>Minimum severity for logs:</label>
				<span class="value level" :data-value="job.log_level">{{ job.log_level }}</span>
			</div>
		</section>

		<slot name="before-description" v-bind="$props"></slot>

		<summary class="description" v-if="job.description || job['federation:missing']">
			<h3>Description</h3>
			<Description v-if="job.description" :description="job.description" />

			<FederationMissingNotice v-if="job['federation:missing']" :missing="job['federation:missing']" :federation="federation" />
		</summary>

		<section v-if="hasLinks" class="links">
			<LinkList :links="job.links" heading="Additional Resources" headingTag="h3" />
		</section>

		<section class="billing" v-if="job.plan || costs || budget">
			<h3>Billing</h3>
			<div class="tabular" v-if="job.plan">
				<label>Billing plan:</label>
				<span class="value">{{ job.plan }}</span>
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
			<Process class="inline" :process="job.process" :provideDownload="false" :showGraph="true">
				<template #process-graph="p"><slot name="process-graph" :v-bind="p" /></template>
			</Process>
		</section>

		<slot name="end" v-bind="$props"></slot>

	</article>
</template>

<script>
import Utils from '../utils';
import FederationMixin from './internal/FederationMixin.js';
import UsageMixin from './internal/UsageMixin.js';

export default {
	name: 'Job',
	mixins: [
		FederationMixin,
		UsageMixin
	],
	components: {
		Description: () => import('./Description.vue'),
		LinkList: () => import('./LinkList.vue'),
		Process: () => import('./Process.vue')
	},
	props: {
		job: {
			type: Object,
			default: () => ({})
		},
		currency: {
			type: String,
			default: null
		},
		...FederationMixin.props
	},
	computed: {
		budget() {
			return Utils.formatBudget(this.job.budget, this.currency, "No limit specified");
		},
		costs() {
			return Utils.formatCurrency(this.job.costs, this.currency);
		},
		created() {
			return Utils.formatTimestamp(this.job.created, 'n/a');
		},
		updated() {
			return Utils.formatTimestamp(this.job.updated, '');
		},
		progress() {
			if (typeof this.job.progress === 'number') {
				return Math.round(this.job.progress*10)/10 + "%";
			}
			else {
				return "0%";
			}
		},
		usage() {
			return this.job.usage;
		},
		hasLinks() {
			return Utils.size(this.job.links) > 0;
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@use './base.scss';

.vue-component.job {
	.progressBar {
		background-color: #eee;
		border: 1px solid #ccc;
		color: black;
		height: 1.2em;
		border-radius: 0.3em;

		.number {
			font-size: 0.8em;
			padding: 0.1em 0.3em;
			display: inline-block;
		}
		.completed {
			background-color: green;
			width: 1px;
			height: 1.2em;
			color: white;
			display: inline-block;
			border-radius: 0.3em;
		}
		&.error .completed {
			background-color: maroon;
		}
	}
}
</style>