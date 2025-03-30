import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { renderToString } from '@vue/server-renderer';

// Helper to get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  // Serve static files from 'dist' - Handled by Vercel's static-build
  // app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));

  // Serve static files from public
  // app.use('/', express.static(path.resolve(__dirname, 'public'), {
  //   index: false
  // }));

  // SSR handler for all routes
  app.get('/*', async (req, res) => {
    const url = req.originalUrl;

    try {
      // 1. Read the HTML template
      const templatePath = path.resolve(__dirname, 'index.html');
      let template = fs.readFileSync(templatePath, 'utf-8');

      // 2. Load the server entry module (adjust path if needed)
      // Using a dynamic import that Vercel can handle
      const serverEntryPath = path.resolve(__dirname, './dist/server-bundle.js');
      const serverEntry = await import(serverEntryPath);

      if (typeof serverEntry.createApp !== 'function') {
        throw new Error('Invalid server entry: createApp function not found.');
      }

      // 3. Create Vue app instance
      const appInstance = serverEntry.createApp({ url }); // Pass url context if needed

      // 4. Render the app instance to string
      const appHtml = await renderToString(appInstance);

      // 5. Inject the rendered app HTML into the template
      const html = template.replace(`<!--vue-ssr-app-->`, appHtml);

      // 6. Send the final HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);

    } catch (error) {
      // Log the error and send a 500 response
      console.error(`[SSR Error] Failed for ${url}:`, error);
      // Avoid sending detailed error messages to the client in production
      res.status(500).send('Internal Server Error');
    }
  });

  return app; // Return the app instance
}

// Initialize the app instance once (improves cold start performance)
let appInstancePromise = createServer();

// Export a handler function compatible with Vercel
export default async (req, res) => {
  try {
    const app = await appInstancePromise; // Reuse initialized app
    return app(req, res); // Pass request to the Express app
  } catch (error) {
    console.error("[Vercel Handler Init Error]:", error);
    res.status(500).send("Failed to initialize server handler.");
  }
};
