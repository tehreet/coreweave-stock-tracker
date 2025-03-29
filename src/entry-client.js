import { createSSRApp } from 'vue';
import App from './App.vue';

// Create the Vue app instance for the client
// Use createSSRApp for proper hydration
const app = createSSRApp(App);

// Mount the app to the DOM
// Vue will hydrate the existing server-rendered markup
app.mount('#app');

console.log('Vue app hydrated on client.');
