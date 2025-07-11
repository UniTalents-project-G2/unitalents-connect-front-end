import { createApp } from 'vue'
import App from './App.vue'
import router from './app/router'
import { PrimeVue } from "@primevue/core";
import { Toast, ToastService } from "primevue";

// 👉 Importa tu hoja de estilos globales
import './assets/main.css';

const app = createApp(App);
app
    .use(PrimeVue)
    .use(router)
    .use(ToastService, { position: 'bottom' })
    .component('pv-toast', Toast)
    .mount('#app')
