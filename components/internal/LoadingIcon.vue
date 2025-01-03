<template>
  <svg class="loading-icon" :class="{rotate}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" width="400px" height="400px">
    <path d="M78.271,21.729C71.028,14.486,61.028,10,50,10C27.944,10,10,27.944,10,50S27.944,90,50,90S90,72.056,90,50L80,50C80,66.542,66.542,80,50,80S20,66.542,20,50S33.458,20,50,20C58.271,20,65.771,23.365,71.203,28.797L60,40L90,40L90,10L78.271,21.729Z" stroke="none"></path>
  </svg>
</template>

<script>
export default {
  name: "LoadingIcon",
  props: {
    rotate: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: 1em;
  line-height: 1em;
  &.rotate {
    animation: loading-icon-rotate 1s infinite linear;
  }
}
@keyframes loading-icon-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>