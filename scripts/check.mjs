import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readRegistry, registryRoot, digest } from "../src/registry.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const creator = JSON.parse(await readFile(path.join(root, "packages/create-camuaui/package.json"), "utf8"));
if (creator.version !== pkg.version || creator.dependencies.camuaui !== pkg.version)
  throw new Error("Creator version mismatch; run npm run creator:build.");
const creatorSyntax = spawnSync(process.execPath, ["--check", path.join(root, "packages/create-camuaui/bin/create-camuaui.js")], { stdio: "inherit" });
if (creatorSyntax.status !== 0) process.exit(creatorSyntax.status ?? 1);
for (const directory of ["src", "bin", "scripts"]) {
  for (const file of await readdir(path.join(root, directory))) {
    if (!/\.m?js$/.test(file)) continue;
    const result = spawnSync(
      process.execPath,
      ["--check", path.join(root, directory, file)],
      { stdio: "inherit" },
    );
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
const registry = await readRegistry();
for (const file of registry.files) {
  const source = await readFile(path.join(registryRoot, file.path), "utf8");
  if (digest(source) !== file.sha256)
    throw new Error(`Registry hash mismatch: ${file.path}`);
  if (/(?:from\s+["'](?:@\/|next[\/"'])|import\s+["']next)/.test(source))
    throw new Error(`Framework dependency: ${file.path}`);
}
console.log("CLI syntax and framework-independent registry checks passed.");
