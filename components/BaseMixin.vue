<script>
import Utils from '../utils.js';

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
	filters: {
		abbrev(text) {
			return Utils.prettifyAbbreviation(text);
		}
	},
	methods: {
        updateData() {
			// To be implemented by the component
		}
	}
}
</script>