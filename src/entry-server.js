import express from 'express';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import App from './App.vue'; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const server = express();

const distPath = path.resolve(__dirname, '.'); 
console.log(`Serving static files from: ${distPath}`);

server.get('/client-bundle.js', (req, res) => {
  const filePath = path.join(distPath, 'client-bundle.js');
  console.log(`Request for static file: ${req.path} -> ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file ${filePath}:`, err);
      res.status(404).send('Static file not found');
    }
  });
});
server.get('/client-bundle.css', (req, res) => {
  const filePath = path.join(distPath, 'client-bundle.css');
  console.log(`Request for static file: ${req.path} -> ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file ${filePath}:`, err);
      res.status(404).send('Static file not found');
    }
  });
});

server.get('/hello-world', (req, res) => {
  console.log('Handling /hello-world route');
  res.send('Hello from the server!');
});

server.get('*', async (req, res) => {
  console.log(`Handling SSR for path: ${req.path}`);
  if (req.path.startsWith('/client-bundle')) {
    console.log('Skipping SSR for static asset path.')
    return res.status(404).send('Not found (handled by specific static routes)');
  }

  const app = createSSRApp(App);

  try {
    console.log('Starting renderToString...');
    const appContent = await renderToString(app);
    console.log('renderToString completed.');

    const templatePath = path.join(__dirname, '../index.html');
    console.log(`Reading template file: ${templatePath}`);
    const html = fs.readFileSync(templatePath, 'utf-8');
    console.log('Template file read successfully.');

    const finalHtml = html
      .replace('<!--ssr-outlet-->', appContent)
      .replace('</head>', '<link rel="stylesheet" href="/client-bundle.css"></head>')
      .replace('</body>', '<script src="/client-bundle.js"></script></body>');

    console.log('Sending final HTML.');
    res.setHeader('Content-Type', 'text/html');
    res.send(finalHtml);
  } catch (error) {
    console.error(`SSR Error for path ${req.path}:`, error);
    res.status(500).send('Server error during rendering');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export default server;
