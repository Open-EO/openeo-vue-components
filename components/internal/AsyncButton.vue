<template>
	<button type="button" v-show="fn" :title="title" :disabled="disabled" class="async-button" :class="{awesome: fa}" @click="update">
		<span class="button-content">
			<span v-if="loading" class="icon loading">
				<i v-if="fa" :class="loadingClasses"></i>
				<LoadingIcon rotate v-else />
			</span>
			<span v-else-if="asyncState === true" class="icon success">
				<i v-if="fa" class="fas fa-check"></i>
				<span v-else>✔️</span>
			</span>
			<span v-else-if="asyncState === false" class="icon error">
				<i v-if="fa" class="fas fa-times"></i>
				<span v-else>❌</span>
			</span>
			<span v-else class="icon default">
				<i v-if="fa" :class="icon"></i>
				<span v-else-if="icon">{{ icon }}</span>
				<LoadingIcon v-else />
			</span>
			<span class="text"><slot></slot></span>
		</span>
	</button>
</template>

<script>
import LoadingIcon from './LoadingIcon.vue';
export default {
  components: { LoadingIcon },
	name: "AsyncButton",
	props: {
		fn: {
			// Asynchronous function to execute when the button is clicked
			type: Function,
			required: true
		},
		fa: {
			// Whether to use Font Awesome icons or not
			type: Boolean,
			default: false
		},
		confirm: {
			// Show a confirmation checkmark once the async action has succeeded
			type: Boolean,
			default: false
		},
		icon: {
			// fa=true: The Font Awesome icon class
			// fa=false: A unicode symbol
			type: String,
			default: ''
		},
		title: {
			// Tooltip text
			type: String,
			default: null
		},
		disabled: {
			// Disable the button
			type: Boolean,
			default: false
		},
		consistent: {
			// Whether the button should show the same icon for the loading animation
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			asyncState: null
		};
	},
	computed: {
		loadingClasses() {
			let classes = this.consistent ? this.icon.split(' ') : ['fas', 'fa-spinner'];
			classes.push('fa-spin');
			return classes;
		}
	},
	methods: {
		async update(event) {
			if (this.asyncState !== null || this.disabled) {
				return;
			}
			try {
				this.$emit('before', event);
				this.loading = true;
				this.asyncState = await this.fn(event);
				if (!this.confirm) {
					this.asyncState = null
				}
				else if (typeof this.asyncState !== 'boolean') {
					this.asyncState = true;
				}
			} catch(e) {
				this.asyncState = false;
			} finally {
				this.loading = false;
				this.$emit('after', this.asyncState);
				if (this.confirm) {
					setTimeout(() => this.asyncState = null, 3000);
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">
.async-button {
	min-width: 2em;

	&:not(.awesome) {
		.icon, .icon > svg, .icon > span {
			display: inline-block;
			width: 1em;
			height: 1em;
			font-size: 1em;
			line-height: 1em;
		}
		.button-content {
			display: flex;
			align-items: center;
		}
	}

	.success {
		color: green;
	}
	.error {
		color: maroon;
	}
	.text {
		display: inline-block;
		margin-left: 0.5em;
	}
	.text:empty {
		display: none;
	}
}
</style>