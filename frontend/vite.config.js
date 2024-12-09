import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {config} from 'dotenv';

config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
  host: "0.0.0.0",
 },
  server: {
  host: "0.0.0.0"
  },
  define: {
   'process.env': process.env
 }
})
