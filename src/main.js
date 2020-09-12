import Vue from 'vue'
import App from './App.vue'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
Vue.config.productionTip = false
// You need a specific loader for CSS files
Vue.use(Datetime)
new Vue({
  render: h => h(App),
}).$mount('#app')
