<template>
	<div class="experimental-notice">
		<strong>Experimental</strong>
		<p>Please note that this {{entity}} is experimental with the potential for major things to change. Feel encouraged to try it out and give feedback, but refrain from using the {{entity}} in production.</p>
	</div>
</template>

<script>
export default {
	name: 'ExperimentalNotice',
	props: {
		entity: String
	}
}
</script>

<style scoped>
.experimental-notice {
	background-color: rgb(138,43,226,0.1);
	border: 1px solid blueviolet;
	margin: 1em 0;
	padding: 0.5em;
}
.experimental-notice strong {
	display: block;
	color: blueviolet;
	margin-bottom: 0.5em;
}
.experimental-notice p {
	margin: 0;
}
</style>