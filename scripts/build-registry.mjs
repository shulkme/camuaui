import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = path.join(root, "registry");
async function walk(directory, prefix = "") {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const relative = `${prefix}${item.name}`;
    if (item.isDirectory())
      result.push(
        ...(await walk(path.join(directory, item.name), `${relative}/`)),
      );
    else if (/\.(tsx?|css)$/.test(item.name)) result.push(relative);
  }
  return result.sort();
}
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const files = [];
for (const file of await walk(registry)) {
  const source = await readFile(path.join(registry, file));
  if (
    /\.(tsx?|jsx?)$/.test(file) &&
    /(?:from\s+["'](?:@\/|next[\/"'])|import\s+["']next)/.test(
      source.toString(),
    )
  )
    throw new Error(`Framework-specific import in ${file}`);
  files.push({
    path: file,
    sha256: createHash("sha256").update(source).digest("hex"),
  });
}
const components = files
  .filter(
    ({ path: name }) =>
      name.startsWith("components/ui/") &&
      !["icons.tsx", "styles.ts", "selection-indicator.tsx"].some((helper) =>
        name.endsWith(`/${helper}`),
      ),
  )
  .map(({ path: name }) => path.basename(name).replace(/\.tsx?$/, ""));
await writeFile(
  path.join(registry, "registry.json"),
  `${JSON.stringify({ schemaVersion: 1, version: pkg.version, components, files }, null, 2)}\n`,
);
console.log(
  `Registry: ${components.length} components, ${files.length} files, version ${pkg.version}`,
);
