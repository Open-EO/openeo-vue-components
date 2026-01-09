<template>
	<div class="vue-component link-list" v-if="friendlyLinks.length > 0">
		<component v-if="heading" :is="headingTag">{{ heading }}</component>
		<ul>
			<li v-for="(link, i) in friendlyLinks" :key="i">
				<a v-if="action" :href="link.href" @click.prevent="action(link)" :rel="link.rel">
					{{ link.title }}
				</a>
				<a v-else :href="link.href" target="_blank" :rel="link.rel">
					{{ link.title }}
				</a>
				<span class="relation" v-if="showRel && link.rel"> ({{ link.rel }})</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { friendlyLinks } from '@openeo/js-commons/src/utils';
import Utils from '../utils';

export default {
	name: 'LinkList',
	props: {
		links: {
			type: Array,
			default: () => ([])
		},
		sort: {
			type: Boolean,
			default: true
		},
		heading: {
			type: String,
			default: null
		},
		headingTag: {
			type: String,
			default: 'strong'
		},
		baseUrl: {
			type: String,
			default: null
		},
		rel: {
			type: Array,
			default: () => []
		},
		ignoreRel: {
			type: Array,
			default: () => ['self']
		},
		showRel: {
			type: Boolean,
			default: false
		},
		action: {
			type: Function,
			default: null
		}
	},
	computed: {
		friendlyLinks() {
			if (this.rel.length > 0) {
				return this.prepareLinks(this.links, this.baseUrl, this.sort, this.rel);
			}
			else {
				return this.prepareLinks(this.links, this.baseUrl, this.sort, this.ignoreRel, true);
			}
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
	methods: {
		prepareLinks(linkList, baseUrl = null, sort = true, rels = ['self'], ignoreRels = false) {
			const links = [];
			if (!Array.isArray(linkList)) {
					return links;
			}

			for(let link of linkList) {
				// Make sure to work on a copy
				link = Object.assign({}, link);
				// Handle relation types
				const rel = typeof link.rel === 'string' ? link.rel.toLowerCase() : '';
				if (ignoreRels && rels.includes(rel)) {
					continue;
				}
				else if (!ignoreRels && !rels.includes(rel)) {
					continue;
				}
				// Add a human-readable title if needed
				if (typeof link.title !== 'string' || link.title.length === 0) {
					// Make URL relative if possible and remove file extension
					const linkUrl = new URL(link.href, baseUrl || undefined);
					linkUrl.hash = '';
					linkUrl.search = '';
					linkUrl.pathname = linkUrl.pathname.split('/').slice(0, -1).join('/') + '/';
					let title = link.href
						.replace(linkUrl.href, '')
						.split('.').slice(0, -1).join('.');
					// Prefix the relation type
					if (typeof link.rel === 'string' && link.rel.length > 1 && rels.length > 1 && ignoreRels) {
						title = Utils.prettifyString(link.rel) + ': ' + title;
					}
					link.title = title;
				}
				// Make href absolute if needed
				if (baseUrl) {
					const url = new URL(link.href, baseUrl);
					link.href = url.href;
				}
				links.push(link);
			}
			if (sort) {
					links.sort((a, b) => Utils.compareStringCaseInsensitive(a.title, b.title));
			}
			return links;
		}
	}
}
</script>

<style lang="scss">
@use './base.scss';
</style>