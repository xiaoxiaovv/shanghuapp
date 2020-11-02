import Vue from 'vue'
import App from './App'
// 2.8.11时下方两行注释掉在app.vue引用
import "./static/assets/css/index.scss"
import "./static/assets/iconfont/iconfont.css"

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()