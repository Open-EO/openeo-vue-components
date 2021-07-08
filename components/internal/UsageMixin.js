import Utils from '../../utils';

const usageLabels = {
	cpu: "CPU usage",
	memory: "Memory usage",
	duration: "Wall time",
	network: "Network Transfer IO",
	disk: "Storage IO",
	storage: "Storage space"
};

export default {
	computed: {
		hasUsageMetrics() {
			return Utils.size(this.usage) > 0;
		}
	},
	filters: {
		usageLabel(key) {
			if (usageLabels[key]) {
				return usageLabels[key];
			}
			else {
				return Utils.prettifyString(key);
			}
		}
	}
};