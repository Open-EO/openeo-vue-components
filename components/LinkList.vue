<template>
	<ul class="vue-component link-list">
		<li v-for="(link, key) in links" :key="key">
			<a :href="link.href" target="_blank" :rel="link.rel">
				<template v-if="link.title">{{ link.title }}</template>
				<template v-else>{{ link.href }}</template>
			</a>
			<span class="relation" v-if="!link.title && link.rel"> ({{ link.rel }})</span>
		</li>
	</ul>
</template>

<script>
import './base.css';

export default {
	name: 'LinkList',
	props: {
		links: Array
	}
}
</script>