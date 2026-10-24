import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createMain } from "../src/create.js";
import { main } from "../src/cli.js";
import { exists } from "../src/paths.js";

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "camuaui-create-test-"));
  t.after(async () => {
    if (path.dirname(path.resolve(root)) !== path.resolve(os.tmpdir()) || !path.basename(root).startsWith("camuaui-create-test-")) throw new Error("Unsafe cleanup");
    await rm(root, { recursive: true, force: true });
  });
  return root;
}
async function write(root, file, source) {
  await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await writeFile(path.join(root, file), source);
}
const read = (root, file) => readFile(path.join(root, file), "utf8");
function scaffold(root, framework, language) {
  return async (cwd, command) => {
    assert.equal(cwd, root);
    assert.equal(command.args[3], framework === "next" ? "create-next-app@latest" : "create-vite@latest");
    const target = command.args[4] === "." ? cwd : path.join(cwd, command.args[4]);
    await write(target, "package.json", JSON.stringify({ name: "fresh", type: "module", dependencies: { react: "^19", "react-dom": "^19", ...(framework === "next" ? { next: "^16" } : {}) }, devDependencies: framework === "vite" ? { vite: "^8" } : {} }));
    if (language === "ts") await write(target, "tsconfig.json", "{}");
    for (const file of framework === "next"
      ? [`src/app/layout.${language === "ts" ? "tsx" : "js"}`, `src/app/page.${language === "ts" ? "tsx" : "js"}`]
      : [`src/main.${language === "ts" ? "tsx" : "jsx"}`, `src/App.${language === "ts" ? "tsx" : "jsx"}`]) await write(target, file, "// framework starter\n");
    await write(target, framework === "next" ? "src/app/globals.css" : "src/index.css", ".starter { color: red; }\n");
  };
}
const services = { interactive: false, log() {} };

test("creator wires fresh Next/Vite TS/JS projects and defaults to an examples homepage", async t => {
  for (const framework of ["next", "vite"]) for (const language of ["ts", "js"]) {
    const root = await fixture(t);
    const result = await createMain(["demo", "--cwd", root, "--framework", framework, "--language", language, "--yes", "--skip-install"], { ...services, scaffold: scaffold(root, framework, language) });
    const target = path.join(root, "demo");
    const config = JSON.parse(await read(target, "camuaui.json"));
    assert.equal(config.examples, true);
    assert.equal(result.framework, framework);
    assert.match(await read(target, config.entry), /UIProvider/);
    const page = framework === "next" ? `src/app/page.${language === "ts" ? "tsx" : "js"}` : `src/App.${language === "ts" ? "tsx" : "jsx"}`;
    assert.match(await read(target, page), /DesignSystem/);
    const css = await read(target, config.css);
    assert.match(css, /@import "tailwindcss"/);
    assert.doesNotMatch(css, /\.starter/);
    assert.equal(JSON.parse(await read(target, "package.json")).dependencies.react, "latest");
    const pkg = JSON.parse(await read(target, "package.json"));
    assert.equal(pkg.dependencies["@base-ui/react"], "latest");
    assert.equal(pkg.devDependencies.tailwindcss, "latest");
    assert.equal(pkg.dependencies["@tanstack/react-virtual"], "latest");
  }
});

test("creator auto-detects existing projects without replacing their entry/page or installing examples by default", async t => {
  const root = await fixture(t);
  await scaffold(root, "vite", "ts")(root, { args: ["exec", "--yes", "--", "create-vite@latest", "."] });
  await createMain(["--cwd", root, "--yes", "--skip-install"], { ...services, scaffold: () => assert.fail("Existing project was scaffolded") });
  assert.equal(await read(root, "src/App.tsx"), "// framework starter\n");
  assert.doesNotMatch(await read(root, "src/main.tsx"), /UIProvider/);
  assert.equal(JSON.parse(await read(root, "camuaui.json")).examples, false);
});

test("creator dry-run is read-only; nonempty and unsafe targets never invoke the framework", async t => {
  const root = await fixture(t);
  const noScaffold = () => assert.fail("Should not scaffold");
  await main(["demo", "--cwd", root, "--framework", "vite", "--dry-run", "--yes"], { ...services, scaffold: noScaffold });
  assert.deepEqual(await readdir(root), []);
  await write(root, "demo/user.txt", "keep");
  await assert.rejects(createMain(["demo", "--cwd", root, "--framework", "next", "--yes"], { ...services, scaffold: noScaffold }), /空目录/);
  assert.equal(await read(root, "demo/user.txt"), "keep");
  await assert.rejects(createMain(["../escape", "--cwd", root, "--yes"], services), /项目名/);
  await assert.rejects(createMain(["--cwd", root, "--framework", "existing"], services), /package.json/);
});

test("skip-framework selection installs into the current project even when given a new directory name", async t => {
  const root = await fixture(t);
  await scaffold(root, "vite", "ts")(root, { args: ["exec", "--yes", "--", "create-vite@latest", "."] });
  await createMain(["unused-name", "--cwd", root, "--skip-install"], { ...services, interactive: true, ask: async question => question.includes("选择框架") ? "3" : "", scaffold: () => assert.fail("Must skip scaffolding") });
  assert.equal(await exists(path.join(root, "unused-name")), false);
  assert.equal(await exists(path.join(root, "camuaui.json")), true);
  assert.equal(await read(root, "src/App.tsx"), "// framework starter\n");
});

test("creator honors prompts and no-examples; dependency failure preserves the framework starter", async t => {
  const root = await fixture(t);
  const replies = ["2", "js", "npm", "n"];
  await createMain(["demo", "--cwd", root, "--skip-install"], { ...services, interactive: true, ask: async () => replies.shift(), scaffold: scaffold(root, "vite", "js") });
  assert.equal(replies.length, 0);
  const config = JSON.parse(await read(path.join(root, "demo"), "camuaui.json"));
  assert.equal(config.examples, false);
  assert.match(await read(path.join(root, "demo"), "src/App.jsx"), /<Button>/);
  assert.equal(JSON.parse(await read(path.join(root, "demo"), "package.json")).dependencies["@tanstack/react-virtual"], undefined);
  const other = await fixture(t);
  await assert.rejects(createMain(["demo", "--cwd", other, "--framework", "vite", "--yes"], { ...services, scaffold: scaffold(other, "vite", "ts"), install: async () => { throw new Error("dependency failed"); } }), /dependency failed/);
  assert.equal(await read(path.join(other, "demo"), "src/App.tsx"), "// framework starter\n");
  assert.equal(await exists(path.join(other, "demo/camuaui.json")), false);
});
