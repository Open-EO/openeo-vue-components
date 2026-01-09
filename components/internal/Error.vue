<template>
	<div class="vue-component message-block error">
		<strong>Error</strong>
		<p>{{ message }}</p>
	</div>
</template>

<script>
import Utils from '../../utils';

export default {
	name: 'Error',
	props: {
		message: String
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@use '../base.scss';

.vue-component.error {
	background-color: rgb(128,0,0,0.1);
	border: 1px solid maroon;

	strong {
		color: maroon;
	}
}
</style>