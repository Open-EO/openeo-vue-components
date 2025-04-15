<template>
	<button class="icon-button" ref="button" disabled @mouseover="mouseover" @mouseleave="mouseleave" @focus="focus" @blur="blur">
		<slot name="icon">⚠</slot>
    <div v-if="showTooltip" class="openeo-vue-tooltip-icon" ref="tooltip" @mouseover="hide"><slot>{{ text }}</slot></div>
	</button>
</template>

<script>
export default {
	name: "BButton",
	props: {
    text: {
      type: String,
      default: ""
    }
	},
	data() {
		return {
			showTooltip: false
		};
	},
	methods: {
    updateTooltip() {
      const tooltip = this.$refs.tooltip?.$el;
      if (!tooltip) {
        return;
      }
      const button = this.$refs.button;
      const pos = button.getBoundingClientRect();
      tooltip.style.top = Math.max(0, (pos.top + button.offsetHeight)) + 1 + 'px';
      tooltip.style.left = Math.max(0, (pos.left + (button.offsetWidth / 2) - (tooltip.offsetWidth / 2))) + 1 + 'px';
    },
    mousemove(event) {
      this.updateTooltip();
      this.$emit('mousemove', event);
    },
    mouseover(event) {
      this.show();
      this.$emit('mouseover', event);
    },
    mouseleave(event) {
      this.hide();
      this.$emit('mouseleave', event);
    },
    focus(event) {
      this.hide();
      this.$emit('focus', event);
    },
    blur(event) {
      this.hide();
      this.$emit('blur', event);
    },
    show() {
      this.showTooltip = true;
      this.$nextTick(() => this.updateTooltip());
    },
    hide() {
      this.showTooltip = false;
    }
	}
}
</script>

<style lang="scss" scoped>
.icon-button {
  background: none;
	color: inherit;
	border: 1px solid transparent;
	font: inherit;
	cursor: pointer;
	outline: none;
}
.openeo-vue-tooltip-icon {
  display: inline-block;
  position: absolute;
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 5px;
  z-index: 9999;
  font-size: 0.9em;
  border: 1px solid #000;
  text-align: center;
  max-width: 250px;
}
</style>