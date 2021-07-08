<template>
	<div class="vue-component styled-description" :class="{compact: compact}" v-html="markup(description)"></div>
</template>

<script>
import * as commonmark from 'commonmark';
import Utils from '../utils';

export default {
	name: 'Description',
	props: {
		description: {
			type: String,
			default: ''
		},
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
		},
		allowHTML: {
			type: Boolean,
			default: false
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	methods: {
		markup(text) {
			if (typeof text !== 'string') {
				return '';
			}

			// Parse our extension to CommonMark, which allows linking to other processes with ``process()``
			// Temporarily replace with a non-commonmark and non-html string to avoid parsing/removal
			if (typeof this.processUrl === 'string') {
				text = text.replace(/(^|[^\w`])``(\w+)\(\)``(?![\w`])/g, (_, prefix, pid) => {
					return `${prefix}@pid:${pid}@@`;
				});
			}

			// Parse CommonMark
			var reader = new commonmark.Parser();
			var writer = new commonmark.HtmlRenderer({safe: !this.allowHTML, smart: true});
			if (typeof this.preprocessor === 'function') {
				text = this.preprocessor(text);
			}
			var parsed = reader.parse(text);
			var rendered = writer.render(parsed);
			if (typeof this.processor === 'function') {
				rendered = this.processor(rendered);
			}
	
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

<style lang="scss">
@import './base.scss';

.vue-component.styled-description {
	line-height: 1.25em;

	code {
		color: maroon;
		display: inline-block;
		padding: 0 0.1em;
	}
	pre {
		background-color: #eee;
		width: 100%;
		border: 1px solid #ccc;
		max-height: 15em;
		overflow-y: auto;
		
		code {
			background-color: transparent; 
			display: block;
			margin: 0.5em;
		}
	}
	&.compact {
		pre {
			max-height: 7em;
			width: auto;
			max-width: 100%;
		}
		p {
			margin: 0.5em 0;

			&:first-child {
				margin-top: 0;
			}
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}
</style>
