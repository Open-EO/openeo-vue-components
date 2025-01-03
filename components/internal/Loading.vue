<template>
	<div class="vue-component loading-notice">
		<span class="loading"><LoadingIcon rotate /> Loading...</span>
	</div>
</template>

<script>
import LoadingIcon from './LoadingIcon.vue'
export default {
  components: { LoadingIcon },
	name: 'Loading'
}
</script>
