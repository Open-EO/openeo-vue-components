<template>
	<div class="depcrecation-notice">
		<strong>Deprecated</strong>
		<p>Please note that this {{entity}} is now deprecated with the potential to be removed in any of the next versions. The {{entity}} should be transitioned out of usage as soon as possible. Refrain from using the {{entity}} in new implementations.</p>
	</div>
</template>

<script>
export default {
	name: 'DepcrecationNotice',
	props: {
		entity: String
	}
}
</script>

<style scoped>
.depcrecation-notice {
	background-color: rgb(255,0,0,0.1);
	border: 1px solid red;
	margin: 1em 0;
	padding: 0.5em;
}
.depcrecation-notice strong {
	display: block;
	color: red;
	margin-bottom: 0.5em;
}
.depcrecation-notice p {
	margin: 0;
}
</style>