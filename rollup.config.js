import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from '@rollup/plugin-vue'; // Use the official Rollup Vue plugin
import replace from '@rollup/plugin-replace';
import css from 'rollup-plugin-css-only'; // Or your preferred CSS handler
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

const baseConfig = {
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      browser: isClientBuild, // Important for resolving browser/node versions
    }),
    commonjs(),
    vue({
      // For SSR, we might need to configure css differently
      css: !isServerBuild, // Extract CSS only for the client build
      template: {
        compilerOptions: {
          // SSR-specific compiler options if needed
        }
      }
    }),
    // Handle CSS extraction for the client build
    isClientBuild && css({ output: 'client-bundle.css' }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      '__VUE_OPTIONS_API__': JSON.stringify(true),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(!isProduction),
      // Define a flag for client/server specific logic in your Vue code if needed
      'process.env.VUE_ENV': JSON.stringify(isServerBuild ? 'server' : 'client')
    }),
  ],
  external: isServerBuild ? ['express', 'fs', 'path', 'url'] : [], // Externalize Node built-ins for server
};

let config;

if (isServerBuild) {
  config = {
    ...baseConfig,
    input: 'src/entry-server.js',
    output: {
      file: path.resolve(__dirname, 'dist/server-bundle.js'),
      format: 'esm', // Use ES Module format for dynamic import in server.js
      exports: 'named',
    },
    // Server build specifics
  };
} else { // Client Build
  config = {
    ...baseConfig,
    input: 'src/entry-client.js',
    output: {
      file: path.resolve(__dirname, 'dist/client-bundle.js'),
      format: 'esm',
      sourcemap: !isProduction,
    },
    // Client build specifics
  };
}

export default config;
