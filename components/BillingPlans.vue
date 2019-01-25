<template>
	<p class="vue-component billing-plans">
		No billing information available (yet).
	</p>
</template>

<script>
import './base.css';

export default {
	name: 'BillingPlans',
	props: {
		version: {
			type: String,
			default: '0.3.1'
		},
		billing: Object
	}
}
</script>