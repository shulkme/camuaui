import { build } from "esbuild";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.resolve(root, "dist");
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== "dist")
  throw new Error("Invalid CLI build output path");
await rm(output, { recursive: true, force: true });
await build({
  absWorkingDir: root,
  entryPoints: { cli: "src/cli.js", create: "src/create.js" },
  outdir: output,
  bundle: true,
  splitting: true,
  // All chunks stay one level below package.json so import.meta.url can locate
  // the registry after installation, independent of the consumer's cwd.
  chunkNames: "shared-[hash]",
  format: "esm",
  platform: "node",
  target: "node20.19",
  packages: "external",
  minify: true,
  sourcemap: false,
  charset: "utf8",
  legalComments: "none",
  logLevel: "info",
});
