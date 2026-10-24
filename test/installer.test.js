import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rm,
  symlink,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ts from "typescript";
import { synchronize } from "../src/installer.js";
import { exists } from "../src/paths.js";
import { addPostcssPlugin } from "../src/css.js";
import { commitFiles } from "../src/transaction.js";
import { main } from "../src/cli.js";

async function fixture(t, { typed = true, pkg = {} } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), "camuaui-test-"));
  t.after(async () => {
    const resolved = path.resolve(root);
    if (!resolved.startsWith(path.join(os.tmpdir(), "camuaui-test-")))
      throw new Error("Unsafe test cleanup");
    await rm(resolved, { recursive: true, force: true });
  });
  await mkdir(path.join(root, "src"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify(
      {
        name: "consumer",
        private: true,
        type: "module",
        dependencies: { react: "^19.3.1", "react-dom": "^19.3.1" },
        ...pkg,
      },
      null,
      2,
    ),
  );
  if (typed) await writeFile(path.join(root, "tsconfig.json"), "{}");
  await writeFile(
    path.join(root, typed ? "src/main.tsx" : "src/main.jsx"),
    'import "./index.css";\nexport {};\n',
  );
  await writeFile(
    path.join(root, "src/index.css"),
    ".user-style { padding: 2rem; }\n",
  );
  return root;
}
const read = (root, relative) => readFile(path.join(root, relative), "utf8");
const sync = (root, options = {}, services = {}) =>
  synchronize({ cwd: root, skipInstall: true, ...options }, services);

test("init copies independent TS components and themes without examples, preserves CSS and configures PostCSS", async (t) => {
  const root = await fixture(t);
  const result = await sync(root);
  assert.equal(result.config.examples, false);
  assert.ok(
    !result.commands.some(({ args }) =>
      args.includes("@tanstack/react-virtual@latest"),
    ),
  );
  assert.equal(
    await exists(path.join(root, "src/components/camuaui-examples/index.tsx")),
    false,
  );
  assert.match(await read(root, "src/components/ui/button.tsx"), /forwardRef/);
  assert.match(
    await read(root, "src/components/ui/button.tsx"),
    /\.\.\/\.\.\/lib\/camuaui/,
  );
  assert.match(
    await read(root, "src/components/ui/provider.tsx"),
    /className="isolate"/,
  );
  const css = await read(root, "src/index.css");
  assert.match(css, /@import "tailwindcss"/);
  assert.match(css, /@import "\.\/styles\/camuaui\/index.css"/);
  assert.match(css, /\.user-style/);
  assert.match(await read(root, "postcss.config.mjs"), /@tailwindcss\/postcss/);
  assert.equal(
    JSON.parse(await read(root, "package.json")).scripts.ui,
    "npx --yes camuaui@latest",
  );
  assert.ok(
    result.commands.some(({ args }) => args.includes("@base-ui/react@latest")),
  );
  assert.ok(
    result.commands.some(({ args }) => args.includes("tailwindcss@latest")),
  );
});

test("update overwrites owned edits, backs up changes, keeps adjacent files and does not duplicate imports", async (t) => {
  const root = await fixture(t);
  await sync(root);
  await writeFile(
    path.join(root, "src/components/ui/button.tsx"),
    "// local button customization\n",
  );
  await writeFile(
    path.join(root, "src/components/ui/my-component.tsx"),
    "// user owned\n",
  );
  const result = await sync(root);
  assert.match(
    await read(root, "src/components/ui/button.tsx"),
    /export const Button/,
  );
  assert.equal(
    await read(root, "src/components/ui/my-component.tsx"),
    "// user owned\n",
  );
  assert.equal(
    await read(root, `${result.backupPath}/src/components/ui/button.tsx`),
    "// local button customization\n",
  );
  assert.equal(
    (await read(root, "src/index.css")).match(/styles\/camuaui\/index.css/g)
      .length,
    1,
  );
  assert.equal(
    (await read(root, "src/index.css")).match(/@import "tailwindcss"/g).length,
    1,
  );
});

test("optional DesignSystem has no routes/framework imports, can be updated and removed without deleting user files", async (t) => {
  const root = await fixture(t);
  const result = await sync(root, { examples: true });
  assert.ok(
    result.commands.some(({ args }) =>
      args.includes("@tanstack/react-virtual@latest"),
    ),
  );
  assert.ok(
    await exists(
      path.join(root, "src/components/camuaui-examples/combobox-examples.tsx"),
    ),
  );
  const index = await read(root, "src/components/camuaui-examples/index.tsx");
  assert.match(index, /export function DesignSystem/);
  assert.doesNotMatch(index, /from "next|Metadata|@\//);
  assert.match(
    await read(root, "src/components/camuaui-examples/component-examples.tsx"),
    /\.\.\/ui\//,
  );
  await writeFile(
    path.join(root, "src/components/camuaui-examples/custom.tsx"),
    "// user component\n",
  );
  await sync(root);
  assert.equal(JSON.parse(await read(root, "camuaui.json")).examples, true);
  await sync(root, { examples: false });
  assert.equal(
    await exists(path.join(root, "src/components/camuaui-examples/index.tsx")),
    false,
  );
  assert.equal(
    await exists(
      path.join(root, "src/components/camuaui-examples/combobox-examples.tsx"),
    ),
    false,
  );
  assert.equal(
    await read(root, "src/components/camuaui-examples/custom.tsx"),
    "// user component\n",
  );
});

test("moving styles removes the previous managed import and preserves custom CSS", async (t) => {
  const root = await fixture(t);
  await sync(root);
  await sync(root, { styles: "src/theme/camuaui" });
  const css = await read(root, "src/index.css");
  assert.doesNotMatch(css, /styles\/camuaui\/index.css/);
  assert.match(css, /theme\/camuaui\/index.css/);
  assert.match(css, /\.user-style/);
  assert.equal(
    await exists(path.join(root, "src/styles/camuaui/index.css")),
    false,
  );
  const config = JSON.parse(await read(root, "camuaui.json"));
  config.styles = "src/new-theme/camuaui";
  config.language = "js";
  await writeFile(path.join(root, "camuaui.json"), JSON.stringify(config));
  await sync(root);
  assert.match(
    await read(root, "src/index.css"),
    /new-theme\/camuaui\/index.css/,
  );
  assert.equal(await exists(path.join(root, "src/lib/camuaui.js")), true);
  assert.equal(await exists(path.join(root, "src/lib/camuaui.ts")), false);
});

test("JSX output strips TS and rewrites custom relative paths including spaces", async (t) => {
  const root = await fixture(t, { typed: false });
  await sync(root, {
    examples: true,
    components: "src/ui kit",
    utils: "src/helpers/classes.js",
    examplesPath: "src/preview",
  });
  const button = await read(root, "src/ui kit/button.jsx");
  assert.match(button, /\.\.\/helpers\/classes/);
  assert.doesNotMatch(button, /interface ButtonProps|forwardRef</);
  assert.equal(
    ts.createSourceFile(
      "button.jsx",
      button,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.JSX,
    ).parseDiagnostics.length,
    0,
  );
  assert.match(
    await read(root, "src/styles/camuaui/index.css"),
    /@source "\.\.\/\.\.\/ui kit"/,
  );
  assert.match(
    await read(root, "src/preview/index.jsx"),
    /\.\.\/ui kit\/button|\.\/examples/,
  );
  assert.equal(await exists(path.join(root, "src/ui kit/button.tsx")), false);
  for (const name of ["autocomplete", "input-otp", "scroll-area", "dialog", "modal", "context-menu"]) {
    const source = await read(root, `src/ui kit/${name}.jsx`);
    assert.equal(
      ts.createSourceFile(`${name}.jsx`, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX).parseDiagnostics.length,
      0,
      `${name} must be valid JSX`,
    );
    assert.doesNotMatch(source, /export (?:interface|type) |function Autocomplete</);
    assert.match(source, /\.\.\/helpers\/classes/);
  }
  assert.match(await read(root, "src/ui kit/dialog.jsx"), /@base-ui\/react\/alert-dialog/);
  assert.match(await read(root, "src/ui kit/modal.jsx"), /@base-ui\/react\/dialog/);
  assert.match(await read(root, "src/preview/input-examples.jsx"), /\.\.\/ui kit\/input-otp/);
  assert.match(await read(root, "src/preview/scroll-area-examples.jsx"), /\.\.\/ui kit\/scroll-area/);
  assert.match(await read(root, "src/preview/context-menu-examples.jsx"), /\.\.\/ui kit\/context-menu/);
  assert.match(await read(root, "src/ui kit/context-menu.jsx"), /from "\.\/menu"/);
});

test("updating the old Dialog warns about the Modal migration and preserves business imports", async (t) => {
  const root = await fixture(t);
  await sync(root);
  const statePath = path.join(root, ".camuaui/manifest.json");
  const previous = JSON.parse(await readFile(statePath, "utf8"));
  previous.version = "0.1.1";
  previous.files = previous.files.filter((file) => !file.path.endsWith("/modal.tsx"));
  await writeFile(statePath, JSON.stringify(previous));
  await rm(path.join(root, "src/components/ui/modal.tsx"));
  const business = 'import { Dialog } from "./components/ui/dialog";\nexport const Screen = Dialog;\n';
  await writeFile(path.join(root, "src/screen.tsx"), business);
  const result = await sync(root);
  assert.ok(result.warnings.some((warning) => /Dialog\*.*Modal\*/.test(warning)));
  assert.equal(await read(root, "src/screen.tsx"), business);
  assert.equal(await exists(path.join(root, "src/components/ui/modal.tsx")), true);
  const repeat = await sync(root);
  assert.ok(!repeat.warnings.some((warning) => /Dialog\*.*Modal\*/.test(warning)));
});

test("dependency installation retains resolved versions and existing npm scripts", async (t) => {
  const root = await fixture(t, {
    pkg: { scripts: { ui: "my-own-ui", dev: "vite" } },
  });
  const calls = [];
  await sync(
    root,
    { skipInstall: false },
    {
      install: async (directory, commands) => {
        calls.push(...commands);
        const pkg = JSON.parse(await read(directory, "package.json"));
        pkg.dependencies["@base-ui/react"] = "^1.9.0";
        pkg.devDependencies = { tailwindcss: "^4.3.3" };
        await writeFile(
          path.join(directory, "package.json"),
          JSON.stringify(pkg),
        );
      },
    },
  );
  assert.ok(
    calls.every(({ args }) =>
      args
        .filter((value) => value.startsWith("@base-ui/"))
        .every((value) => value.endsWith("@latest")),
    ),
  );
  const pkg = JSON.parse(await read(root, "package.json"));
  assert.equal(pkg.dependencies["@base-ui/react"], "^1.9.0");
  assert.equal(pkg.devDependencies.tailwindcss, "^4.3.3");
  assert.equal(pkg.scripts.ui, "my-own-ui");
  assert.equal(pkg.scripts["ui:sync"], "npx --yes camuaui@latest");
});

test("dry-run and canceled interaction do not mutate target project", async (t) => {
  const root = await fixture(t);
  const before = await read(root, "package.json");
  await sync(root, { dryRun: true });
  assert.equal(await read(root, "package.json"), before);
  assert.equal(await exists(path.join(root, "camuaui.json")), false);
  assert.equal(await exists(path.join(root, ".camuaui")), false);
  const answers = ["", "", "", "", "yes", "n"];
  const prompts = [];
  const canceled = await main(["--cwd", root, "--skip-install"], {
    interactive: true,
    ask: async (question) => {
      prompts.push(question);
      return answers.shift();
    },
    log() {},
  });
  assert.equal(canceled.canceled, true);
  assert.ok(prompts.some((question) => question.includes("DesignSystem")));
  assert.equal(await exists(path.join(root, "src/components")), false);
});

test("interactive example opt-in installs DesignSystem", async (t) => {
  const root = await fixture(t);
  const answers = ["", "", "", "", "yes", "y"];
  await main(["--cwd", root, "--skip-install"], {
    interactive: true,
    ask: async () => answers.shift(),
    log() {},
  });
  assert.equal(
    await exists(path.join(root, "src/components/camuaui-examples/index.tsx")),
    true,
  );
});

test("CLI reports install and write stages only after the previous stage succeeds", async (t) => {
  const root = await fixture(t);
  const failed = [];
  await assert.rejects(
    main(["--cwd", root, "--yes"], {
      color: false,
      log: (line) => failed.push(line),
      install: async () => { throw new Error("registry unavailable"); },
    }),
    /registry unavailable/,
  );
  assert.ok(failed.some((line) => line.includes("安装项目依赖")));
  assert.ok(!failed.some((line) => /依赖安装完成|写入组件、样式|已同步/.test(line)));
  assert.equal(await exists(path.join(root, "camuaui.json")), false);

  const completed = [];
  await main(["--cwd", root, "--yes"], {
    color: false,
    log: (line) => completed.push(line),
    install: async () => {},
  });
  const installed = completed.findIndex((line) => line.includes("依赖安装完成"));
  const writing = completed.findIndex((line) => line.includes("写入组件、样式与配置"));
  const finished = completed.findIndex((line) => line.includes("已同步"));
  assert.ok(installed >= 0 && writing > installed && finished > writing);
  assert.ok(!completed.some((line) => line.includes("发布后")));
  assert.equal(await exists(path.join(root, "src/components/ui/button.tsx")), true);
});

test("dependency failure leaves source untouched and Tailwind 3 is rejected before mutation", async (t) => {
  const root = await fixture(t);
  await assert.rejects(
    sync(
      root,
      { skipInstall: false },
      {
        install: async () => {
          throw new Error("network failure");
        },
      },
    ),
    /network failure/,
  );
  assert.equal(await exists(path.join(root, "src/components")), false);
  const old = await fixture(t, {
    pkg: { devDependencies: { tailwindcss: "^3.4.0" } },
  });
  await assert.rejects(sync(old), /Tailwind 3/);
  assert.equal(await exists(path.join(old, "postcss.config.mjs")), false);
});

test("existing Vite Tailwind plugin and nested CSS imports avoid duplicate setup", async (t) => {
  const root = await fixture(t);
  await writeFile(
    path.join(root, "vite.config.ts"),
    'import tailwind from "@tailwindcss/vite"; export default { plugins: [tailwind()] };',
  );
  await writeFile(
    path.join(root, "src/tailwind.css"),
    '@import "tailwindcss";\n',
  );
  await writeFile(
    path.join(root, "src/index.css"),
    '@import "./tailwind.css";\n.user-style {}',
  );
  const result = await sync(root);
  assert.equal(await exists(path.join(root, "postcss.config.mjs")), false);
  assert.equal(
    (await read(root, "src/index.css")).includes('@import "tailwindcss"'),
    false,
  );
  assert.ok(
    result.commands.some(({ args }) =>
      args.includes("@tailwindcss/vite@latest"),
    ),
  );
});

test("PostCSS object/array integrations preserve existing plugins and reject dynamic configs", async () => {
  const object = addPostcssPlugin(
    'export default { plugins: { autoprefixer: {}, "my-plugin": {} } };',
    "postcss.config.mjs",
  );
  assert.match(object, /autoprefixer/);
  assert.match(object, /@tailwindcss\/postcss/);
  const array = addPostcssPlugin(
    'module.exports = { plugins: [require("autoprefixer")()] };',
    "postcss.config.cjs",
  );
  assert.match(array, /require\("@tailwindcss\/postcss"\)/);
  assert.match(array, /require\("autoprefixer"\)/);
  assert.throws(
    () => addPostcssPlugin("export default makeConfig()", "postcss.config.mjs"),
    /无法安全修改/,
  );
});

test("output traversal and symlinked directories cannot overwrite outside project", async (t) => {
  const root = await fixture(t);
  await assert.rejects(sync(root, { components: "../escape" }), /路径不能离开/);
  const outside = await fixture(t);
  await symlink(
    outside,
    path.join(root, "src/link"),
    process.platform === "win32" ? "junction" : "dir",
  );
  await assert.rejects(sync(root, { components: "src/link/ui" }), /符号链接/);
  assert.equal(await exists(path.join(outside, "ui")), false);
});

test("partial write failure rolls back overwritten and newly created files", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "before.txt"), "original");
  let count = 0;
  await assert.rejects(
    commitFiles(
      root,
      new Map([
        ["before.txt", "replaced"],
        ["new.txt", "new"],
        ["fail.txt", "error"],
      ]),
      [],
      {
        backup: false,
        write: async (...args) => {
          if (++count === 3) throw new Error("disk error");
          return writeFile(...args);
        },
      },
    ),
    /已恢复/,
  );
  assert.equal(await read(root, "before.txt"), "original");
  assert.equal(await exists(path.join(root, "new.txt")), false);
  assert.equal(
    (await readdir(root)).some((file) => file.endsWith(".tmp")),
    false,
  );
});
