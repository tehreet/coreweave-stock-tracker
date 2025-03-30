import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue'; // Use the official Rollup Vue plugin
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss'; // Use postcss
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine environment based on flag passed to rollup command
const isProduction = process.env.NODE_ENV === 'production';
const isServerBuild = process.env.SERVER === 'true';
const isClientBuild = process.env.CLIENT === 'true';

if (!isServerBuild && !isClientBuild) {
  throw new Error('Build environment not specified. Use --environment SERVER or --environment CLIENT');
}

// Base plugins used by both builds (excluding vue and css)
const basePlugins = [
  nodeResolve({
    preferBuiltins: true,
    browser: isClientBuild,
  }),
  commonjs(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    '__VUE_OPTIONS_API__': JSON.stringify(true),
    '__VUE_PROD_DEVTOOLS__': JSON.stringify(!isProduction),
    'process.env.VUE_ENV': JSON.stringify(isServerBuild ? 'server' : 'client')
  }),
];

// Server-specific plugins
const serverPlugins = [
  ...basePlugins,
  vue({
    css: false, // Let postcss handle CSS
    template: { compilerOptions: {} }
  }),
  postcss({ // Process CSS imports but discard output for server
    inject: false,
    extract: false,
    modules: true,
    minimize: false, // No need to minimize on server
    sourceMap: false,
  }),
];

// Client-specific plugins
const clientPlugins = [
  ...basePlugins,
  vue({
    css: false, // Let postcss handle CSS
    template: { compilerOptions: {} }
  }),
  postcss({
    extract: 'client-bundle.css', // Extract CSS for client
    modules: true, // Enable CSS Modules if needed
    minimize: isProduction,
    sourceMap: !isProduction,
  })
];

let config;

if (isServerBuild) {
  config = {
    // input, output, external for server
    input: 'src/entry-server.js',
    output: {
      file: path.resolve(__dirname, 'dist/server-bundle.js'),
      format: 'esm',
      exports: 'named',
    },
    external: ['express', 'fs', 'path', 'url'],
    plugins: serverPlugins, // Use server-specific plugins
  };
} else { // Client Build
  config = {
    // input, output for client
    input: 'src/entry-client.js',
    output: {
      file: path.resolve(__dirname, 'dist/client-bundle.js'),
      format: 'esm',
      sourcemap: !isProduction,
    },
    plugins: clientPlugins, // Use client-specific plugins
  };
}

export default config;
