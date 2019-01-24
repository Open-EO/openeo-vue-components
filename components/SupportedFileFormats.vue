<template>
	<ul class="file-formats">
		<li v-for="(args, name) in formats.formats" :key="name">{{ name.toUpperCase() }}</li>
	</ul>
</template>

<script>
export default {
	name: 'SupportedFileFormats',
	props: {
		version: String,
		formats: Object
	}
}
</script>

<style scoped>

</style>