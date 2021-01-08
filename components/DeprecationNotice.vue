<template>
	<div class="vue-component message-block depcrecation-notice">
		<strong>Deprecated</strong>
		<p>Please note that this {{entity}} is now deprecated with the potential to be removed in any of the next versions. It should be transitioned out of usage as soon as possible. Refrain from using it in new implementations.</p>
	</div>
</template>

<script>
import './base.css';

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
}
.depcrecation-notice strong {
	display: block;
	color: red;
}
</style>