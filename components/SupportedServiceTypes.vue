<template>
	<ul class="vue-component service-types">
		<li v-for="(args, name) in services" :key="name">{{ name }}</li>
	</ul>
</template>

<script>
import './base.css';

export default {
	name: 'SupportedServiceTypes',
	props: {
		version: String,
		services: Object
	}
}
</script>