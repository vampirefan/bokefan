import Vue from 'vue'
import axios from 'axios'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import moment from 'moment'

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Vue.filter('toDate', date => {
  return moment(date).format('YYYY.MM.DD')
})
Vue.filter('toDateTime', date => {
  return moment(date).format('YYYY.MM.DD HH:mm')
})
