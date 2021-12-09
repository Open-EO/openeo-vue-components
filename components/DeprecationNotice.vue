<template>
	<div class="vue-component message-block deprecation-notice">
		<strong>Deprecated</strong>
		<p>Please note that this {{entity}} is now deprecated with the potential to be removed in any of the next versions. It should be transitioned out of usage as soon as possible. Refrain from using it in new implementations.</p>
	</div>
</template>

<script>
import Utils from '../utils';

export default {
	name: 'DeprecationNotice',
	props: {
		entity: String
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.deprecation-notice {
	background-color: rgb(255,0,0,0.1);
	border: 1px solid red;

	strong {
		display: block;
		color: red;
	}
}
</style>