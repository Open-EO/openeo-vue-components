<template>
	<div class="vue-component styled-description" :class="{compact: compact}" v-html="markup(description)"></div>
</template>

<script>
import commonmark from 'commonmark';
import './base.css';

export default {
	name: 'Description',
	props: {
		description: String,
		preprocessor: {
			type: Function,
			default: null
		},
		processor: {
			type: Function,
			default: null
		},
		processUrl: {
			type: String,
			default: null
		},
		compact: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		preprocessorFunc() {
			if (typeof this.preprocessor === 'function') {
				return this.preprocessor;
			}
			else {
				return text => text;
			}
		},
		processorFunc() {
			if (typeof this.processor === 'function') {
				return this.processor;
			}
			else {
				return text => text;
			}
		}
	},
	methods: {
		markup(text) {
			// Parse our extension to CommonMark, which allows linking to other processes with ``process()``
			// Temporarily replace with a non-commonmark and non-html string to avoid parsing/removal
			if (typeof this.processUrl === 'string') {
				text = text.replace(/(^|[^\w`])``(\w+)\(\)``(?![\w`])/g, (_, prefix, pid) => {
					return `${prefix}@pid:${pid}@@`;
				});
			}

			// Parse CommonMark
			var reader = new commonmark.Parser();
			var writer = new commonmark.HtmlRenderer({safe: true, smart: true});
			var parsed = reader.parse(this.preprocessorFunc(text));
			var rendered = this.processorFunc(writer.render(parsed));
	
			// Replace temporary replacement code with process link
			if (typeof this.processUrl === 'string') {
				rendered = rendered.replace(/@pid:(\w+)@@/g, (_, pid) => this.linkToProcess(pid));
			}

			return rendered;
		},
		linkToProcess(processId) {
			let url = this.processUrl.replace('${}', encodeURIComponent(processId));
			let target = this.processUrl.startsWith('#') ? '_self' : '_blank';
			return `<code><a href="${url}" target="${target}" class="process-link">${processId}</a></code>`;
		}
	}
}
</script>

<style>
.vue-component.styled-description {
	line-height: 1.25em;
}
.vue-component.styled-description.compact p {
	margin: 0.5em 0;
}
.vue-component.styled-description.compact p:first-child {
	margin-top: 0;
}
.vue-component.styled-description.compact p:last-child {
	margin-bottom: 0;
}
.vue-component.styled-description pre {
	background-color: #eee;
	width: 100%;
	border: 1px solid #ccc;
	max-height: 15em;
	overflow-y: auto;
}
.vue-component.styled-description.compact pre {
	max-height: 7em;
	width: auto;
	max-width: 100%;
}
.vue-component.styled-description pre code {
	background-color: transparent; 
	display: block;
	margin: 0.5em;
}
.vue-component.styled-description code {
	color: maroon;
	display: inline-block;
	padding: 0 0.1em;
}
</style>
