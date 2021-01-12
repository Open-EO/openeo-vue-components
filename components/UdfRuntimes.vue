<template>
	<ul class="vue-component udf-runtimes">
		<li v-for="(env, name) in runtimes" :key="name">
			<strong>{{ name }}</strong>
			<template v-if="env.title"> - {{ env.title }}</template>
			<ul class="badges small">
				<template v-if="env.type === 'docker' || (env.docker && env.tags)">
					<li class="badge docker">Docker: {{ env.docker }}</li>
					<li class="badge version" :class="{default: tag === env.default}" v-for="tag in env.tags" :key="tag">{{ tag }}</li>
				</template>
				<template v-else>
					<li class="badge version" :class="{default: version === env.default}" v-for="(lang, version) in env.versions" :key="version">{{ version }}</li>
				</template>
			</ul>
		</li>
	</ul>
</template>

<script>
import Utils from '../utils';

export default Utils.enableHtmlProps({
	name: 'UdfRuntimes',
	props: {
		runtimes:  {
			type: Object,
			default: () => ({})
		}
	}
})
</script>

<style>
@import url('./base.css');
</style>

<style scoped>
ul.udf-runtimes:empty::after {
	content: 'None';
	font-style: italic;
}

.badges {
	margin-left: 0.5em;
}
</style>