<template>
	<div class="vue-component link-list" v-if="friendlyLinks.length > 0">
		<component v-if="heading" :is="headingTag">{{ heading }}</component>
		<ul>
			<li v-for="(link, key) in friendlyLinks" :key="key">
				<a :href="link.href" target="_blank" :rel="link.rel">{{ link.title }}</a>
				<span class="relation" v-if="showRel && link.rel"> ({{ link.rel }})</span>
			</li>
		</ul>
	</div>
</template>

<script>
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
		ignoreRel: {
			type: Array,
			default: () => ['self']
		},
		showRel: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		friendlyLinks() {
			return Utils.friendlyLinks(this.links, this.sort, this.ignoreRel);
		}
	},
	beforeCreate() {
		Utils.enableHtmlProps(this);
	}
}
</script>

<style>
@import url('./base.css');
</style>