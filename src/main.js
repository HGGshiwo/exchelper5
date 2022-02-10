import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'


createApp(App).use(ElementPlus).use(store).use(router).mount('#app')
