import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: true,
        hydratable: false
      }
    })
  ],
  test: {
    environment: 'jsdom'
  }
})