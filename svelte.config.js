import { vitePreprocess } from "@astrojs/svelte"

export default {
  preprocess: vitePreprocess(),
  kit: {
    // Disable kit since we're using Astro
    adapter: null
  },
  compilerOptions: {
    enableSourcemap: true
  },
  vitePlugin: {
    experimental: {
      inspector: false
    }
  }
}
