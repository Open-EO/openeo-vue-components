<template>
	<div class="vue-component loading-notice">
		<span class="loading">Loading</span>
	</div>
</template>

<script>
export default {
	name: 'Loading'
}
</script>

<style scoped>
.loading:after {
	content: '.';
	animation: dots 1.25s steps(5, end) infinite;
	font-size: 1.5em;
	line-height: 1em;
	font-weight: bold;
}

@keyframes dots {
	0%, 20% {
		color: rgba(0,0,0,0);
		text-shadow:
			.25em 0 0 rgba(0,0,0,0),
			.5em 0 0 rgba(0,0,0,0);
		}
	40% {
		color: black;
		text-shadow:
			.25em 0 0 rgba(0,0,0,0),
			.5em 0 0 rgba(0,0,0,0);
	}
	60% {
		text-shadow:
			.25em 0 0 black,
			.5em 0 0 rgba(0,0,0,0);
	}
	80%, 100% {
		text-shadow:
			.25em 0 0 black,
			.5em 0 0 black;
	}
}
</style>