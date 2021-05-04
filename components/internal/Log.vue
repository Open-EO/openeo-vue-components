<template>
	<li class="vue-component log-entry" :class="{[log.level]: true, expanded: expanded}">
		<summary>
			<span class="toggle" @click="toggle()">▸</span>
			<span class="log-message" @click="!expanded && toggle()">{{ log.message }}</span>
		</summary>
		<ul class="details" v-if="expanded">
			<li>ID: {{ log.id }}</li>
			<li v-if="log.code">Code: {{ log.code }}</li>
			<li>Level: {{ log.level }}</li>
			<li v-if="Array.isArray(log.path) && log.path.length">
				Path:
				<ol class="path">
					<li v-for="(path, i) in path" :key="i">#{{ path.node_id }}</li>
				</ol>
			</li>
			<li v-if="(typeof log.data !== 'undefined' && log.data !== null)">
				Data:<br />
				<ObjectTree :data="log.data" />
			</li>
			<li v-if="Array.isArray(log.links) && log.links.length">
				Related Resources:<br />
				<LinkList :links="log.links" />
			</li>
		</ul>
	</li>
</template>

<script>
export default {
	name: 'Log',
	components: {
		LinkList: () => import('../LinkList.vue'),
		ObjectTree: () => import('../ObjectTree.vue')
	},
	props: {
		log: {
			type: Object,
			default: () => ([])
		}
	},
	computed: {
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

<style scoped>
.log-entry {
	padding: 0.25em 0;
}
summary {
	display: flex;
}
summary .log-message {
	flex-grow: 1;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
}
.expanded summary .log-message {
	white-space: normal;
	overflow: unset;
	text-overflow: unset;
	cursor: inherit;
}
.details {
	margin: 0.5em 0 1em 1.6em;
	padding-left: 1.5em;
	font-size: 0.9em;
}
.info, .debug, .warning, .error {
	width: auto;
}
.info {
	color: black;
}
.debug {
	color: gray;
}
.warning {
	border: 1px solid #f9d67a;
	background-color: #fbeabc;
	color: #795600;
}
.error {
	border: 1px solid #f97a7a;
	background-color: #fbbcbc;
	color: #790000;
}
.toggle {
	display: inline-block;
	width: 0.6em;
	height: 1em;
	margin: 0 0.5em;
	cursor: pointer;
}
.expanded .toggle {
	top: 1em;
	transform: rotate(90deg);
}
.path {
	display: inline-block;
	margin: 0;
	padding: 0;
	list-style: none;
}
.path li {
	display: inline;
}
.path li+li:before {
	padding: 0.25em;
	content: "❱";
}
</style>