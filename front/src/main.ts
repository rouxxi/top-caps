import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from './router.ts'
import {store} from './store.ts'

createApp(App)
.use(store)
.use(router)
.mount('#app')
