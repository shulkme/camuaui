import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit", windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args[0]} failed; no npm publish was started.`);
  return result.stdout?.trim();
}
function npm(args) {
  if (!process.env.npm_execpath) throw new Error("Run this script with npm run release -- patch|minor|major|x.y.z");
  return run(process.execPath, [process.env.npm_execpath, ...args]);
}
try {
  const bump = process.argv[2];
  if (!bump || process.argv.length !== 3 || !/^(patch|minor|major|\d+\.\d+\.\d+)$/.test(bump)) throw new Error("Usage: npm run release -- patch|minor|major|x.y.z");
  if (run("git", ["branch", "--show-current"], true) !== "main") throw new Error("Release from main.");
  if (run("git", ["status", "--porcelain"], true)) throw new Error("Commit source changes before releasing.");
  npm(["version", bump, "--no-git-tag-version"]);
  npm(["run", "registry:build"]);
  npm(["run", "creator:build"]);
  npm(["pack", "--pack-destination", "."]);
  npm(["pack", "./packages/create-camuaui", "--pack-destination", "."]);
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  run("git", ["add", "package.json", "package-lock.json", "packages/create-camuaui/package.json", "packages/create-camuaui/LICENSE", "registry/registry.json"]);
  run("git", ["commit", "-m", `Release v${pkg.version}`]);
  run("git", ["push", "origin", "main"]);
  console.log(`Source pushed. GitHub Actions will check and publish both packages at ${pkg.version}.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
