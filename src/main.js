import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'


const app = createApp(App)
app.use(createPinia())
app.use(VueGoodTablePlugin);
app.use(router)
app.mount('#app')