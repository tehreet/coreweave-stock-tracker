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
      console.log(`[Vercel SSR] Request received for: ${url}`); // Log 1

      // 1. Read the HTML template
      let template;
      try {
        template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        console.log('[Vercel SSR] Read index.html template.'); // Log 2
      } catch (readError) {
        console.error('[Vercel SSR] Error reading index.html:', readError);
        return res.status(500).end('Internal Server Error: Cannot read template');
      }

      // 2. Load the server entry module
      let createApp;
      try {
        console.log('[Vercel SSR] Attempting to import server bundle...'); // Log 3
        const serverEntry = await import('./dist/server-bundle.js');
        createApp = serverEntry.createApp;
        console.log('[Vercel SSR] Imported server bundle successfully.'); // Log 4
        if (typeof createApp !== 'function') {
          throw new Error('createApp is not a function in server bundle');
        }
      } catch (importError) {
        console.error('[Vercel SSR] Error importing server bundle:', importError);
        return res.status(500).end('Internal Server Error: Cannot load server entry');
      }

      // 3. Create Vue app instance and render it to string
      let appInstance;
      try {
        console.log('[Vercel SSR] Creating Vue app instance...'); // Log 5
        appInstance = createApp(); // Pass context if needed (e.g., URL)
        console.log('[Vercel SSR] Created Vue app instance.'); // Log 6
      } catch (createAppError) {
        console.error('[Vercel SSR] Error creating Vue app instance:', createAppError);
        return res.status(500).end('Internal Server Error: Cannot create app');
      }

      let appHtml;
      try {
        console.log('[Vercel SSR] Rendering Vue app to string...'); // Log 7
        appHtml = await renderToString(appInstance);
        console.log('[Vercel SSR] Rendered Vue app to string.'); // Log 8
      } catch (renderError) {
        console.error('[Vercel SSR] Error rendering Vue app:', renderError);
        // Note: We might still try to send a response even if rendering fails partially
        // or handle differently depending on the error.
        // For timeout issues, this block might not even be reached if renderToString hangs.
        return res.status(500).end('Internal Server Error: Rendering failed');
      }

      // 4. Inject the app-rendered HTML into the template
      const html = template.replace(`<!--vue-ssr-app-->`, appHtml);
      console.log('[Vercel SSR] Injected HTML into template.'); // Log 9

      // 5. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      console.log('[Vercel SSR] Response sent.'); // Log 10
    } catch (e) {
      // This is a general catch block, specific errors handled above
      console.error('[Vercel SSR] General catch block error:', e);
      // Avoid using vite?.ssrFixStacktrace(e) in production/Vercel
      res.status(500).end(e.message || 'Internal Server Error');
    }
  });

  return app; // Return the app instance from createServer
}

// Initialize the app instance once
let appInstancePromise = createServer();

// Export a handler function for Vercel
export default async (req, res) => {
  try {
    const app = await appInstancePromise; // Wait for app initialization
    // Pass the request to the initialized Express app
    return app(req, res);
  } catch (error) {
    console.error("[Vercel Handler Error] Failed to initialize or handle request:", error);
    res.status(500).send("Internal Server Error initializing handler.");
  }
};
