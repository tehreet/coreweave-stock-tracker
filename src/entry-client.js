import { createSSRApp } from 'vue';
import App from './App.vue'; // Always mount the main App for hydration

// In a real app, you might check window.__INITIAL_STATE__ 
// or the current path to determine which component to mount.
// For simplicity, we hydrate the main App component.

const app = createSSRApp(App);

// Mount the app to the DOM element rendered by the server
app.mount('#app');
