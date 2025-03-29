import { createSSRApp } from 'vue';
import App from './App.vue';

// This function will be called by the server for each request
export function createApp() {
  const app = createSSRApp(App);
  // Configure app instance if needed (e.g., router, plugins)
  
  // Return just the app instance directly for simplicity
  // The server-renderer might expect just the instance itself
  return app;
}
