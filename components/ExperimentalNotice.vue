<template>
	<div class="vue-component message-block experimental-notice">
		<strong>Experimental</strong>
		<p>Please note that this {{entity}} is experimental with the potential for major things to change. Feel encouraged to try it out and give feedback, but refrain from using it in production.</p>
	</div>
</template>

<script>
import Utils from '../utils';

export default {
	name: 'ExperimentalNotice',
	props: {
		entity: String
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style lang="scss">
@use './base.scss';

.vue-component.experimental-notice {
	background-color: rgb(138,43,226,0.1);
	border: 1px solid blueviolet;

	strong {
		color: blueviolet;
	}
}
</style>