<template>
	<div class="vue-component object-tree" :class="{inline: size === 0}">
		<em v-if="size === 0">{{ format(data) }}</em>
		<template v-else-if="Array.isArray(data)">
			<ol>
				<li v-for="i in indicesShown" :key="i">
					<openeo-object-tree v-if="isStructured(data[i])" :data="data[i]"></openeo-object-tree>
					<a v-else-if="isUrl(data[i])" :href="data[i]" target="_blank">{{ data[i] }}</a>
					<em v-else-if="format(data[i])">{{ format(data[i]) }}</em>
					<template v-else>{{ data[i] }}</template>
				</li>
			</ol>
			<button type="button" @click="show" v-if="size !== indicesShown.length">Show all {{ data.length }} entries</button>
		</template>
		<ul v-else-if="typeof data === 'object'">
			<li v-for="(value, key) in data" :key="key">
				<strong>{{ prettifyKey(key) }}</strong>: 
				<openeo-object-tree v-if="isStructured(value)" :data="value"></openeo-object-tree>
				<a v-else-if="isUrl(value)" :href="value" target="_blank">{{ value }}</a>
				<em v-else-if="format(value)">{{ format(value) }}</em>
				<template v-else>{{ value }}</template>
			</li>
		</ul>
		<template v-else>{{ data }}</template>
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
		isSingleValue() {
			return (Array.isArray(this.data) && this.data.length === 1 && Utils.size(this.data[0]) === 0);
		},
		size() {
            if (typeof this.data === 'object') {
				return Utils.size(this.data);
			}
			else {
				return 1; // One scalar value
			}
		},
		indicesShown() {
			if (!Array.isArray(this.data)) {
				return [];
			}
			let arr = this.data;
			if (!this.expand && this.collapseAfter !== null && this.size > this.collapseAfter) {
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
		isStructured(value) {
			return Utils.size(value) > 0;
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

			return null;
		},
		isUrl(url) {
			return Utils.isUrl(url, false);
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