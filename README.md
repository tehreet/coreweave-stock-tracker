# CoreWeave Stock Tracker

A simple web application to display CoreWeave stock information using a TradingView widget. This application uses Vue.js with Server-Side Rendering (SSR) powered by Node.js and Express.

## Tech Stack

-   **Frontend:** Vue.js 3
-   **SSR Framework:** Express.js
-   **Server:** Node.js
-   **Bundler:** Rollup.js
-   **Charting:** TradingView Lightweight Charts Widget

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd coreweave-stock-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Building the Project

To build the client and server bundles for production:

```bash
npm run build
```

This command will:
- Build the client-side assets and place them in the `dist/client` directory.
- Build the server-side bundle (`server-bundle.js`) and place it in the `dist` directory.

## Running the Server

After building the project, you can start the server:

```bash
node server.js
```

The application will be accessible at `http://localhost:5173` (or the port specified by the `PORT` environment variable).