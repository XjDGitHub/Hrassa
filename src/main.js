import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import components from './components'
import App from './App'
import store from './store'
import router from './router'
import * as directives from './directives'
import * as filters from '@/filters'
import checkPermission from './mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control
import Print from 'vue-print-nb'
Vue.use(Print);
Vue.mixin(checkPermission)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(components)
Vue.config.productionTip = false
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
