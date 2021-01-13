import Vue from 'vue';
import Examples from './Examples.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(Examples),
}).$mount('#app');