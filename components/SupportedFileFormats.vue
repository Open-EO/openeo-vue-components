<template>
	<ul class="vue-component file-formats">
		<li v-for="(args, name) in formats.formats" :key="name">{{ name.toUpperCase() }}</li>
	</ul>
</template>

<script>
import './base.css';

export default {
	name: 'SupportedFileFormats',
	props: {
		version: String,
		formats: Object
	}
}
</script>