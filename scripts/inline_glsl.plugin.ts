import { dirname, join } from "node:path";
import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";

export function viteInlineGLSL(): Plugin
{
    return {
        name: "inline-glsl",
        transformIndexHtml: {
            order: "pre",
            async handler(html, ctx)
            {
                // Directory containing the current index.html.
                const src = dirname(ctx.filename);

                for (const [name, type] of [
                    ["vertex", "x-shader/x-vertex"],
                    ["fragment", "x-shader/x-fragment"],
                ])
                {
                    let shader = await readFile(
                        join(src, `${name}.glsl`),
                        "utf8"
                    );

                    shader = ("\n" + shader)
                        .replace(/\r?\n|\r/g, "\n\t\t");

                    const original =
                        `<script id="${name}_shader" type="${type}" src="./${name}.glsl"></script>`;

                    const replacement =
                        `<script id="${name}_shader" type="${type}">${shader}\n\t</script>`;

                    if (!html.includes(original))
                        throw new Error(`Cannot find ${name} shader tag.`);

                    html = html.replace(original, () => replacement);
                }

                return html;
            },
        },
    };
}