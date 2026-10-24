import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, copyFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

test("stable launcher fetches the latest core, preserves arguments and propagates exit status", async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), "camuaui-launcher-test-"));
  t.after(async () => {
    if (path.dirname(root) !== path.resolve(os.tmpdir()) || !path.basename(root).startsWith("camuaui-launcher-test-")) throw Error("Unsafe cleanup");
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(path.join(root, "node_modules/cross-spawn"), { recursive: true });
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await writeFile(path.join(root, "node_modules/cross-spawn/package.json"), '{"type":"module","exports":"./index.js"}');
  await writeFile(path.join(root, "node_modules/cross-spawn/index.js"), `import fs from 'node:fs'; export default {sync(command,args){fs.writeFileSync('forwarded.json',JSON.stringify({command,args}));return {status:37};}};`);
  await copyFile(new URL("../packages/create-camuaui/bin/create-camuaui.js", import.meta.url), path.join(root, "launcher.js"));
  const result = spawnSync(process.execPath, [path.join(root, "launcher.js"), "my-app", "--framework", "next", "--cwd", "directory with spaces"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 37);
  const forwarded = JSON.parse(await readFile(path.join(root, "forwarded.json"), "utf8"));
  assert.deepEqual(forwarded, { command: "npm", args: ["exec", "--yes", "--prefer-online", "--package=camuaui@latest", "--", "create-camuaui", "my-app", "--framework", "next", "--cwd", "directory with spaces"] });
  const pkg = JSON.parse(await readFile(new URL("../packages/create-camuaui/package.json", import.meta.url), "utf8"));
  assert.equal(pkg.dependencies.camuaui, undefined);
  const core = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(core.bin["create-camuaui"], "./bin/create-camuaui.js");
});
