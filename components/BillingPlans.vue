<template>
	<p class="billing-plans">
		No billing information available (yet).
	</p>
</template>

<script>
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

<style scoped>

</style>