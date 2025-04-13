import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';
import App from './App.vue';
import router from './router';
import './style.css';

// Create app instance
const app = createApp(App);

// Install plugins
app.use(createPinia());
app.use(router);
app.use(VueApexCharts);

// Mount app
app.mount('#app');