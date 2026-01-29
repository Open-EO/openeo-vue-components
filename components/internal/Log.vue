<template>
	<li class="vue-component log-entry" :class="{[log.level]: true, expanded: expanded}">
		<summary>
			<span class="toggle" @click="toggle()">▸</span>
			<span class="log-message" @click="!expanded && toggle()">{{ log.message }}</span>
			<ul class="badges small inline" v-if="log.level">
				<li class="badge time" v-if="relativeTime" :title="formattedTime">{{ relativeTime }}</li>
				<li class="badge" :class="log.level">{{ log.level }}</li>
			</ul>
		</summary>
		<ul class="details" v-if="expanded">
			<li v-if="log.code">Code: {{ log.code }}</li>
			<li v-if="Array.isArray(log.path) && log.path.length">
				Path:
				<ol class="path">
					<li v-for="(path, i) in path" :key="i">
						<strong><code>#{{ path.node_id }}</code></strong>
						<template v-if="path.process_id">
							<br />Process: <code>{{ path.process_id }}</code>
							<template v-if="path.namespace"> in namespace <code>{{ path.namespace }}</code></template>
							<template v-if="path.parameter"><br />Parameter: <code>{{ path.parameter }}</code></template>
						</template>
					</li>
				</ol>
			</li>
			<li v-if="hasData">
				Data:
				<ObjectTree :data="log.data" />
			</li>
			<li v-if="hasUsageMetrics">
				Usage metrics:
				<ul class="usage">
					<li v-for="(metric, key) in usage" :key="key">
						<strong class="metric">{{ key | usageLabel }}</strong>:
						{{ metric.value | usageValue }} <span class="unit">{{ metric.unit }}</span>
					</li>
				</ul>
			</li>
			<li>ID: {{ log.id }}</li>
			<li v-if="Array.isArray(log.links) && log.links.length">
				Related Resources:
				<LinkList :links="log.links" />
			</li>
			<div v-if="log.stacktrace != null && log.stacktrace != ''">
				<li>Stack Trace:</li>
				<textarea class="stacktrace" readonly variant="outlined">{{ log.stacktrace }}</textarea>
			</div>
		</ul>
	</li>
</template>

<script>
import Utils from '../../utils';
import UsageMixin from './UsageMixin.js';

const timeUnits = [
	{
		length: 1000,
		unit: 'ms'
	},
	{
		length: 60,
		unit: 's'
	},
	{
		length: 60,
		unit: 'm'
	},
	{
		length: 24,
		unit: 'h'
	}
];

export default {
	name: 'Log',
	mixins: [
		UsageMixin
	],
	components: {
		LinkList: () => import('../LinkList.vue'),
		ObjectTree: () => import('../ObjectTree.vue')
	},
	props: {
		log: {
			type: Object,
			default: () => ([])
		},
		startTime: {
			type: String,
			default: null
		}
	},
	computed: {
		hasData() {
			return typeof this.log.data !== 'undefined';
		},
		usage() {
			return this.log.usage;
		},
		relativeTime() {
			if (!this.startTime || !this.log.time) {
				return null;
			}
			else if (this.log.time === this.startTime) {
				return Utils.formatTimestamp(this.log.time);
			}
			try {
				let start = new Date(this.startTime);
				let future = new Date(this.log.time);
				let delta = future - start;
				let parts = [];
				for(let temp of timeUnits) {
					let remainder = delta % temp.length;
					delta -= remainder;
					if (remainder !== 0) {
						parts.push(remainder + temp.unit);
					}
					if (delta < temp.length) {
						break;
					}
					else {
						delta /= temp.length;
					}
				}
				return '+' + parts.reverse().join(' ');
			} catch (error) {
				return null;
			}
		},
		formattedTime() {
			return Utils.formatTimestamp(this.log.time);
		},
		path() {
			return this.log.path.reverse();
		}
	},
	data() {
		return {
			expanded: false
		};
	},
	methods: {
		toggle() {
			this.expanded = !this.expanded;
		}
	}
};
</script>

<style lang="scss">
.vue-component.log-entry {
	padding: 0.25em 0;

	.details {
		margin: 0.5em 0 1em 1.6em;
		padding-left: 2em;
		font-size: 0.9em;

		> li {
			margin: 0.5em 0;
		}
	}
	.stacktrace {
		display: block;
		height: 25em;
		width: calc(100% - 1em);
		margin-right: 1em;
		resize: none;
	}
	summary {
		display: flex;

		.log-message {
			flex-grow: 1;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			cursor: pointer;
		}
		.toggle {
			display: inline-block;
			width: 0.6em;
			height: 1em;
			margin: 0 0.5em;
			cursor: pointer;
		}
	}
	&.expanded {
		summary {
			.log-message {
				white-space: normal;
				overflow: unset;
				text-overflow: unset;
				cursor: inherit;
			}
			.toggle {
				top: 1em;
				transform: rotate(90deg);
			}
		}
	}
}
</style>