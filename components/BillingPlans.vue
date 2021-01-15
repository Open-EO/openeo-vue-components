<template>
	<section class="vue-component billing-plans">
		<div class="billing-currency">
			<template  v-if="currency !== null">
				<strong>Currency:</strong> {{ currency }}
			</template>
			<template v-else>No billing information provided.</template>
		</div>
		<h4>Plans</h4>
		<ul v-if="currency !== null && plans.length">
			<li v-for="(plan, key) in plans" :key="key">
				<strong class="plan-name">
					<a v-if="plan.url" :href="plan.url" target="_blank">{{ plan.name }}</a>
					<template v-else>{{ plan.name }}</template>
				</strong>
				<ul class="badges small inline">
					<li class="badge default" v-if="defaultPlan == plan.name">default</li>
					<li class="badge red" v-if="plan.paid === true">paid</li>
					<li class="badge green" v-else-if="plan.paid === false">free</li>
				</ul>
				<Description v-if="plan.description" :description="plan.description" :compact="true" />
			</li>
		</ul>
		<div v-else>No plans available.</div>
	</section>
</template>

<script>
import Description from './Description.vue';
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'BillingPlans',
	components: {
		Description
	},
	props: {
		billing: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		currency() {
			return typeof this.billing.currency === 'string' ? this.billing.currency : null;
		},
		defaultPlan() {
			return typeof this.billing.default_plan === 'string' ? this.billing.default_plan : null;
		},
		plans() {
			return Array.isArray(this.billing.plans) ? this.billing.plans : [];
		}
	},
	methods: {
		prettify(name) {
			return Utils.prettifyAbbreviation(name);
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>

<style scoped>
.plan-name {
	margin: 0.25em 0;
	padding: 0.2em 0;
	line-height: 1em;
	vertical-align: baseline;
}
</style>