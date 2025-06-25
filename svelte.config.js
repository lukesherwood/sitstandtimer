import { vitePreprocess } from "@astrojs/svelte"

export default {
  preprocess: vitePreprocess({
    postcss: false
  }),
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
