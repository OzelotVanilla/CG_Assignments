import { defineConfig } from "vite"
import { viteInlineGLSL } from "./scripts/inline_glsl.plugin"

export default defineConfig({
    server: {
        port: 3000,
        strictPort: true,
    },
    plugins: [
        viteInlineGLSL()
    ]
})