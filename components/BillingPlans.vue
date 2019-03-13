<template>
	<section class="vue-component billing-plans">
		<strong>Currency:</strong> {{ billing.currency }}
		<h4>Plans</h4>
		<ul>
			<li v-for="(plan, key) in billing.plans" :key="key">
				<strong class="plan-name">
					<a v-if="plan.url" :href="plan.url" target="_blank">{{ plan.name }}</a>
					<template v-else>{{ plan.name }}</template>
				</strong>
				<ul class="badges small">
					<li class="badge default" v-if="billing.default_plan == plan.name">default</li>
					<li class="badge paid" v-if="billing.paid === true">paid</li>
					<li class="badge free" v-else-if="billing.paid === false">free</li>
				</ul>
				<Description v-if="plan.description" :description="plan.description" />
			</li>
		</ul>
	</section>
</template>

<script>
import Description from './Description.vue';
import './base.css';

export default {
	name: 'BillingPlans',
	components: {
		Description
	},
	props: {
		version: {
			type: String,
			default: '0.3.1'
		},
		billing: Object
	}
}
</script>

<style scoped>
.badges {
	margin-left: 0.5em;
}
.badges .free {
	background-color: green;
}
.badges .paid {
	background-color: maroon;
}
.badges .default {
	background-color: darkblue;
}
.plan-name {
	margin: 0.25em 0;
	padding: 0.2em 0;
	line-height: 1em;
	vertical-align: baseline;
}
</style>