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
		</section>

		<slot name="before-description" v-bind="$props"></slot>

		<summary class="description" v-if="job.description">
			<h3>Description</h3>
			<Description :description="job.description" />
		</summary>

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
				<label>Budget:</label>
				<span class="value">{{ budget }}</span>
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

export default {
	name: 'Job',
	components: {
		Description: () => import('./Description.vue'),
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
		}
	},
	computed: {
		budget() {
			return Utils.formatBudget(this.job.budget, this.currency);
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
		}
	}
}
</script>

<style scoped>
.progressBar {
	background-color: #eee;
	border: 1px solid #ccc;
	color: black;
	height: 1.2em;
	border-radius: 0.3em;
}
.progressBar .number {
	font-size: 0.8em;
	padding: 0.1em 0.3em;
	display: inline-block;
}
.progressBar .completed {
	background-color: green;
	width: 1px;
	height: 1.2em;
	color: white;
	display: inline-block;
	border-radius: 0.3em;
}
.progressBar.error .completed {
	background-color: maroon;
}
</style>

<style>
@import url('./base.css');
</style>