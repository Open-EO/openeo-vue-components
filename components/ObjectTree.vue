<template>
	<div class="vue-component object-tree" :class="{inline: !isComplex}">
		<openeo-object-tree v-if="type === 'array' && data.length === 1" :data="data[0]" />
		<template v-else-if="type === 'array' && isComplex">
			<ol>
				<li v-for="i in indicesShown" :key="i">
					<openeo-object-tree :data="data[i]" />
				</li>
			</ol>
			<button type="button" @click="show" v-if="size !== indicesShown.length">Show all {{ data.length }} entries</button>
		</template>
		<ul v-else-if="type === 'object' && isComplex">
			<li v-for="(value, key) in data" :key="key">
				<strong>{{ prettifyKey(key) }}</strong>: <openeo-object-tree :data="value" />
			</li>
		</ul>
		<a v-else-if="type === 'url'" :href="data" target="_blank">{{ data }}</a>
		<template v-else-if="type === 'number' || type === 'string'">{{ data }}</template>
		<template v-else-if="type === 'boolean'">{{ format(data) }}</template>
		<em v-else>{{ format(data) }}</em>
	</div>
</template>

<script>
import Utils from '../utils.js';

export default {
	name: 'ObjectTree',
	components: {
		// Workaround for issue https://github.com/vuejs/vue-cli/issues/6225
		'openeo-object-tree': () => import('./ObjectTree.vue')
	},
	props: {
		data: {
			default: null
		},
		// Set to null to disable collapsing
		collapseAfter: {
			type: Number,
			default: 10
		}
	},
	
	data() {
		return {
			expand: false
		};
	},
	computed: {
		type() {
			if (Array.isArray(this.data)) {
				return 'array';
			}
			else if (this.data === null) {
				return 'null';
			}
			else if (Utils.isUrl(this.data, false)) {
				return 'url';
			}
			else {
				return typeof this.data;
			}
		},
		isComplex() {
			if (this.type === 'array') {
				return this.data.length > 1;
			}
			else if (this.type === 'object') {
				return Utils.size(this.data) > 0;
			}
			else {
				return false;
			}
		},
		size() {
			if (typeof this.data === 'object') {
				return Utils.size(this.data);
			}
			else if (typeof this.data === 'string' || typeof this.data === 'number') {
				return 1; // A number or string
			}
			else {
				return 0; // A scalar value
			}
		},
		indicesShown() {
			if (!Array.isArray(this.data)) {
				return [];
			}
			let arr = this.data;
			if (!this.expand && this.collapseAfter !== null && Utils.size(arr) > this.collapseAfter) {
				arr = Array(this.collapseAfter);
			}
			return [...arr.keys()];
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	methods: {
		prettifyKey(key) {
			return Utils.prettifyString(key);
		},
		show() {
			this.expand = true;
		},
		format(value) {
			if (value === null) {
				return 'N/A';
			}
			else if (value === true) {
				return '✔️';
			}
			else if (value === false) {
				return '❌';
			}
			else if (typeof value === 'object' && Utils.size(value) === 0) {
				return 'Empty';
			}
			else if (typeof value === 'function') {
				return 'JavaScript Function';
			}
			else if (typeof value === 'symbol') {
				return 'JavaScript Symbol';
			}

			return value;
		}
	}
}
</script>

<style lang="scss">
@use './base.scss';

.vue-component.object-tree {
	.inline {
		display: inline-block;
	}
	ol {
		padding-left: 2em;
		margin-bottom: 0.5em;

		> li:only-child {
			list-style-type: none;
			margin-left: -2em;
		}

		> li > div > ul {
			padding-left: 0;
		}
	}
	ul {
		padding-left: 1em;

		> li {
			list-style-type: none;
		}
	}
	li {
		margin-bottom: 0.25em;
	}
}

</style>