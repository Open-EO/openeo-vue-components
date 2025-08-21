<template>
	<div class="vue-component collapse" :class="{expanded: show}">
    <component :is="headingTag" class="heading" @click="toggleHeading">
      {{ title }}
    </component>
		<div class="body" v-show="show">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Collapse',
	props: {
		title: {
			type: String,
			default: null
		},
    headingTag: {
      type: String,
      default: 'h2'
    },
		collapsed: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			show: !this.collapsed
		};
	},
  watch: {
		collapsed(newState) {
			this.show = newState;
		}
	},
  methods: {
		toggleHeading() {
			this.show = !this.show;
			this.$emit('headingToggled', this.show);
		}
	}
}
</script>

<style lang="scss" scoped>
.collapse {
	.heading {
		cursor: pointer;
		padding-left: 1em;

		&:before {
			content: "▸";
			margin-left: -1em;
			float: left;
			font-size: 1em;
		}
	}
	&.expanded .heading:before {
		content: "▾";
	}
}
</style>