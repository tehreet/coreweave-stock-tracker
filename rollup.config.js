import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from '@vitejs/plugin-vue'; // Using Vite's Vue plugin for SFC handling
import replace from '@rollup/plugin-replace';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';

// Determine build target from environment variable passed via CLI
const isClientBuild = process.env.CLIENT === 'true';
const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
  nodeResolve(),
  commonjs(),
  vue({ /* options */ }), // Handles .vue files (template, script, style)
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    '__VUE_OPTIONS_API__': JSON.stringify(true), // Enable options API if needed
    '__VUE_PROD_DEVTOOLS__': JSON.stringify(!isProduction),
  }),
];

const clientConfig = {
  input: 'src/entry-client.js',
  output: {
    file: 'dist/client-bundle.js',
    format: 'esm', // ES module for modern browsers
    sourcemap: !isProduction,
  },
  plugins: [
    ...sharedPlugins,
    css({ output: 'client-bundle.css' }), // Extract CSS for the client
    isProduction && terser(), // Minify in production
  ],
};

const serverConfig = {
  input: 'src/entry-server.js',
  output: {
    file: 'dist/server-bundle.js',
    format: 'esm', // ES module for Node.js
    sourcemap: !isProduction,
  },
  plugins: [
    ...sharedPlugins,
    css({ output: false, // Don't output CSS for server bundle
            emitFiles: false }), // Prevent emitting assets on server build
    // Server-specific plugins might go here
  ],
  external: ['vue', '@vue/server-renderer', 'express', 'fs', 'path', 'url'], // Externalize Node built-ins and deps
};

// Export the config based on the environment variable
export default isClientBuild ? clientConfig : serverConfig;
