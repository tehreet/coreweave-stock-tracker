const express = require('express');
const { createSSRApp } = require('vue');
const { renderToString } = require('@vue/server-renderer');
const fs = require('fs');
const path = require('path');
const App = require('./App.vue').default; // Ensure default export is used if needed

const server = express();

// Remove static file serving - Vercel handles this via routes
// const distPath = path.resolve(__dirname, '../dist'); 
// console.log(`Serving static files from: ${distPath}`);
// server.use(express.static(distPath)); 

// Keep specific routes if they have server-side logic beyond simple rendering
server.get('/hello-world', (req, res) => {
  console.log('Handling /hello-world route');
  res.send('Hello from the server!');
});

// Main SSR Handler
server.get('*', async (req, res) => {
  console.log(`Handling SSR for path: ${req.path}`);
  
  // Optional: Add more robust static asset skipping if needed
  if (req.path.startsWith('/client-bundle') || req.path.startsWith('/assets')) {
    console.log('Skipping SSR for static asset path.')
    return res.status(404).send('Not found'); // Let Vercel handle static via routes
  }

  const app = createSSRApp(App);

  try {
    console.log('Starting renderToString...');
    const appContent = await renderToString(app);
    console.log('renderToString completed.');

    // Correct path for Vercel deployment (assuming index.html is alongside server-bundle.js)
    const templatePath = path.resolve(__dirname, 'index.html');
    console.log(`Reading template file: ${templatePath}`);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`Template file not found at ${templatePath}`);
      return res.status(500).send('Server configuration error: Template not found.');
    }
    
    const html = fs.readFileSync(templatePath, 'utf-8');
    console.log('Template file read successfully.');

    // Replace only the SSR outlet
    const finalHtml = html.replace('<!--vue-ssr-app-->', appContent);

    console.log('Sending final HTML.');
    res.setHeader('Content-Type', 'text/html');
    res.send(finalHtml);
  } catch (error) {
    console.error(`SSR Error for path ${req.path}:`, error);
    res.status(500).send('Server error during rendering');
  }
});

// Export the app for Vercel
module.exports = server;
