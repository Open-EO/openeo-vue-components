export default {
  data() {
    return {
      canCopy: false
    }
  },
	mounted() {
		this.canCopy = navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
	},
  methods: {
    copyText(text, onSuccess = null, onError = null) {
      if (this.canCopy) {
        const promise = navigator.clipboard.writeText(text)
        if (onSuccess) {
          promise.then(onSuccess);
        }
        if (onError) {
          promise.catch(onError);
        }
      }
    },
		toggleIcon(elem, newIcon) {
			if (elem) {
				let oldIcon = elem.innerText;
				elem.innerText = newIcon;
				setTimeout(() => elem.innerText = oldIcon, 2000);
			}
		}
  }
}