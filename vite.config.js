// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './public',  // Point this to your desired root directory
  server: {
    port: 5900  // This can be omitted if you wish to use the default port (3000)
  }
});
