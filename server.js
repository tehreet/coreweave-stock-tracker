import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { renderToString } from '@vue/server-renderer';

// Helper to get __dirname in ES module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5173; // Use environment port or default

async function createServer() {
  const app = express();

  // Serve static files from dist (built client assets)
  // Use strong caching in production
  app.use('/', express.static(path.resolve(__dirname, 'dist'), {
    index: false, // Don't serve index.html directly from static
    maxAge: isProduction ? '1y' : 0
  }));

  // Serve static files from public
  app.use('/', express.static(path.resolve(__dirname, 'public'), {
    index: false
  }));

  // Server-Side Rendering
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      // 1. Read the HTML template
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );

      // 2. Load the server entry module
      // In production, this is pre-built. In dev, it might need transformation
      // For this basic setup, we assume it's always pre-built by Rollup
      const { createApp } = await import('./dist/server-bundle.js');

      // 3. Create Vue app instance and render it to string
      const appInstance = createApp(); // Pass context if needed (e.g., URL)
      const appHtml = await renderToString(appInstance);

      // 4. Inject the app-rendered HTML into the template
      const html = template.replace(`<!--vue-ssr-app-->`, appHtml);

      // 5. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      // vite?.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  }

  return app; // Export the app instance for Vercel
}

export default createServer; // Export the function for Vercel's build process
