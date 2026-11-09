/**
 * Adopt from ChatGPT.
 */;

import { readdir, access, rm, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { build } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteInlineGLSL } from "./inline_glsl.plugin.ts";


const source_paths = [
    "src/shader__beginner/decreasing_intensity",
    "src/shader__beginner/letter_A",
    "src/shader__beginner/spinning_box",
    "src/ramiel_a_joke_to_me",
]

const output_dir = resolve("output");

// Clear previous results.
await rm(output_dir, { recursive: true, force: true });
await mkdir(output_dir, { recursive: true });

// Build to output.
for (const source_path of source_paths)
{
    const name = source_path.split("/").at(-1)!
    const src = source_path;
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
