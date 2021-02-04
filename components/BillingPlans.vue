<template>
	<section class="vue-component billing-plans">
		<component v-if="heading" :is="headingTag">{{ heading }}</component>
		<strong>Plans</strong>
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
		<p v-else>No plans available.</p>
		<div class="billing-currency">
			<template  v-if="currency !== null">
				<strong>Currency:</strong> {{ currency }}
			</template>
			<template v-else>No billing information provided.</template>
		</div>
	</section>
</template>

<script>
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'BillingPlans',
	components: {
		Description: () => import(/* webpackChunkName: "description" */'./Description.vue')
	},
	props: {
		billing: {
			type: Object,
			default: () => ({})
		},
		heading: {
			type: String,
			default: 'Billing'
		},
		headingTag: {
			type: String,
			default: 'h2'
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
	}
})
</script>

<style>
@import url('./base.css');

.vue-component.billing-plans .plan-name {
	margin: 0.25em 0;
	padding: 0.2em 0;
	line-height: 1em;
	vertical-align: baseline;
}
</style>