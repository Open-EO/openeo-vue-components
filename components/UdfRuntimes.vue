<template>
	<ul class="vue-component udf-runtimes">
		<li v-for="(env, name) in udfRuntimes" :key="name">
			<strong>{{ name }}</strong>
			<template v-if="env.title"> - {{ env.title }}</template>
			<ul class="badges small">
				<template v-if="env.docker">
					<li class="badge docker">Docker</li>
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
import Utils from '../utils.js';
import { Utils as CommonUtils } from '@openeo/js-commons';
import BaseMixin from './BaseMixin.vue';
import { MigrateCapabilities } from '@openeo/js-commons';
import './base.css';

export default {
	name: 'UdfRuntimes',
	mixins: [BaseMixin],
	props: {
		runtimes: Object
	},
	computed: {
		udfRuntimes() {
			return MigrateCapabilities.convertUdfRuntimesToLatestSpec(this.runtimes, this.version);
		}
	},
	methods: {
		getCount() {
			return CommonUtils.size(this.udfRuntimes);
		}
	}
}
</script>

<style scoped>
ul.udf-runtimes:empty::after {
	content: 'None';
	font-style: italic;
}

.badges {
	margin-left: 0.5em;
}
.badges .docker {
	background-color: #0db7ed;
}
.badges .default {
	background-color: black;
}
</style>