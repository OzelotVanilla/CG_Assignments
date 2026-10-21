/**
 * Adopt from ChatGPT.
 */;

import { readdir, access, rm, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteInlineGLSL } from "./inline_glsl.plugin.ts";


const source_dir = resolve("src/shader__beginner");
const output_dir = resolve("output");
const entries = (await readdir(source_dir, { withFileTypes: true, }))
    .filter(entry => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

// Clear previous results.
await rm(output_dir, { recursive: true, force: true });
await mkdir(output_dir, { recursive: true });

// Build to output.
for (const entry of entries)
{
    const name = entry.name;
    const src = join(source_dir, name);
    const dest = join(output_dir, name);

    try
    {
        await access(join(src, "index.html"));
    }
    catch
    {
        throw new Error(`ERR: ${name} has no \`index.html\`.`);
    }

    console.log(`Building: ${name}...`);

    await build({
        configFile: false,
        root: src,
        base: "./",
        publicDir: false,

        plugins: [
            viteInlineGLSL(),
            viteSingleFile(),
        ],

        build: {
            outDir: dest,
            minify: false,
            emptyOutDir: false,
            copyPublicDir: false,
        },
    });
}

console.log("All WebGL assignments built!");
