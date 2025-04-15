<template>
	<button ref="button" :type="type" :title="nativeTitle" :disabled="disabled" :name="name" :value="value"
  @click="click" @mouseover="mouseover" @mouseleave="mouseleave" @focus="focus" @blur="blur">
		<slot>{{ text }}</slot>
	</button>
</template>

<script>
export default {
	name: "BButton",
	props: {
    type: {
      type: String,
      default: 'button'
    },
    text: {
      type: String,
      default: ""
    },
		title: {
			type: String,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
    name: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
		nativeTooltip: {
			// Whether to use the native browser tooltip
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			showTooltip: false,
      nativeTooltip_: this.nativeTooltip,
      element: null,
      container: null
		};
	},
  mounted() {
    this.container = document.getElementsByTagName('body')[0];
    if (!this.container) {
      this.container = this.$refs.button.parentNode;
      if (!this.container) {
        this.nativeTooltip_ = true;
      }
    }
  },
  beforeDestroy() {
    this.removeTooltip();
  },
  computed: {
    nativeTitle() {
      return this.nativeTooltip_ ? this.title : null;
    }
  },
  watch: {
    nativeTooltip(newValue) {
      this.nativeTooltip_ = newValue;
    },
    showTooltip(newValue) {
      if (this.nativeTooltip_) {
        return;
      }
      if (newValue) {
        this.createTooltip();
      }
      else {
        this.removeTooltip();
      }
    },
    title() {
      if (this.title) {
        this.updateTooltip();
      }
      else {
        this.showTooltip = false;
      }
    }
  },
	methods: {
    createTooltip() {
      if (!this.container || !this.title) {
        return;
      }
      if (this.element) {
        this.removeTooltip();
      }
      this.element = document.createElement('div');
      this.element.className = 'openeo-vue-tooltip';
      this.element.addEventListener('mouseover', () => this.showTooltip = false);
      this.container.appendChild(this.element);
      this.updateTooltip();
    },
    updateTooltip() {
      if (!this.element) {
        return;
      }
      this.element.innerText = this.title;
      const el = this.$refs.button;
      const pos = el.getBoundingClientRect();
      this.element.style.top = Math.max(0, (pos.top + el.offsetHeight)) + 1 + 'px';
      this.element.style.left = Math.max(0, (pos.left + (el.offsetWidth / 2) - (this.element.offsetWidth / 2))) + 1 + 'px';
    },
    removeTooltip() {
      if (!this.container || !this.element) {
        return;
      }
      if (this.container.contains(this.element)) {
        this.container.removeChild(this.element);
      }
      this.element = null;
    },
    click(event) {
      this.$emit('click', event);
    },
    mousemove(event) {
      this.updateTooltip();
      this.$emit('mousemove', event);
    },
    mouseover(event) {
      this.showTooltip = true;
      this.$emit('mouseover', event);
    },
    mouseleave(event) {
      this.showTooltip = false;
      this.$emit('mouseleave', event);
    },
    focus(event) {
      this.showTooltip = true;
      this.$emit('focus', event);
    },
    blur(event) {
      this.showTooltip = false;
      this.$emit('blur', event);
    }
	}
}
</script>

<style lang="scss">
.openeo-vue-tooltip {
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