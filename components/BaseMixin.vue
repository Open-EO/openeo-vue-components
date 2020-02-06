<script>
export default {
	props: {
		version: {
			type: String,
			required: false,
			default: "1.0.0"
		}
	},
    created() {
        this.updateData();
    },
    watch: {
        version() {
            this.updateData();
        }
    },
	methods: {
        updateData() {
			// To be implemented by the component
		}
	}
}
</script>