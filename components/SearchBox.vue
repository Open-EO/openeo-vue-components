<template>
	<div class="vue-component search-box" :class="{compact}">
		<span class="icon">🔎</span>
		<input type="search" v-model="searchTerm" :placeholder="placeholder" :minlength="minLength" :title="searchHint" />
	</div>
</template>

<script>
export default {
	name: 'SearchBox',
	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: 'Search'
		},
		minLength: {
			type: Number,
			default: 1
		},
		compact: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			searchTerm: this.value
		};
	},
	watch: {
		searchTerm(newValue, oldValue) {
			if (newValue.length < this.minLength) {
				newValue = '';
			}
			this.$emit('input', newValue);
		}
	},
	computed: {
		searchHint() {
			if (this.minLength > 1) {
				return `Searching requires at least ${this.minLength} characters.`;
			}
			return null;
		}
	}
}
</script>

<style lang="scss">
@import './base.scss';

.vue-component.search-box {
    margin: 0 1px 1em 0;
	display: flex;
	align-items: stretch;

	input, .icon {
		font-size: 1em;
		margin: 0;
	}
	input {
		flex-grow: 1;
		padding: 0.3em;
		padding-left: 1.9em;
		z-index: 1;
		border: 1px solid #ccc;
		box-sizing: content-box;
		background-color: #fff;
		box-sizing: border-box;
		width: 100%;
		margin-left: -1.3em;
	}
	.icon {
		display: flex;
		align-items: center;
		user-select: none;
		margin-left: 0.3em;
		width: 1em;
		z-index: 2;
	}
	&.compact {
		font-size: 0.9em;
		margin-bottom: 0;

		input {
			padding-top: 0;
			padding-bottom: 0;
		}
		.icon {
			margin-top: 0.1em;
			margin-left: 0.3em;
		}
	}
}
</style>