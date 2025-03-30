import express from 'express';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your Vue components
import App from './App.vue'; // Main App shell if needed
import HelloWorld from './HelloWorld.vue'; // Example component

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

// Middleware to serve static files from 'dist' (for client bundle, css, assets)
// Note: Vercel might handle this automatically via static-build output dir,
// but having it here ensures local dev works and provides clarity.
server.use(express.static(path.resolve(__dirname, '../dist'), { index: false }));

// Function to render Vue component with props
async function renderVueComponent(component, props = {}) {
  const app = createSSRApp(component, props);
  return await renderToString(app);
}

// Example route rendering HelloWorld component
server.get('/hello-world', async (req, res) => {
  try {
    const message = "Message from Server!"; // Example prop
    const appHtml = await renderVueComponent(HelloWorld, { message });

    // Read the HTML template (you might want to cache this)
    const templatePath = path.resolve(__dirname, '../index.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Inject the rendered HTML and potentially other things (like initial state)
    const html = template.replace(`<!--vue-ssr-app-->`, appHtml);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (e) {
    console.error('SSR Error:', e);
    res.status(500).send('Internal Server Error');
  }
});

// Catch-all route for the main App (optional, adjust as needed)
// server.get('*', async (req, res) => {
//   try {
//     const appHtml = await renderVueComponent(App); // No props for main app shell
//     const templatePath = path.resolve(__dirname, '../index.html');
//     let template = fs.readFileSync(templatePath, 'utf-8');
//     const html = template.replace(`<!--vue-ssr-app-->`, appHtml);
//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).send(html);
//   } catch (e) {
//     console.error('SSR Error:', e);
//     res.status(500).send('Internal Server Error');
//   }
// });

// Export the server instance for Vercel
export default server;

// Optional: Add local listener if not running on Vercel
// if (process.env.NODE_ENV !== 'production') {
//   const port = process.env.PORT || 3000;
//   server.listen(port, () => {
//     console.log(`Server listening on http://localhost:${port}`);
//   });
// }
