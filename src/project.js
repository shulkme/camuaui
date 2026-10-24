import path from "node:path";
import { exists, readOptional } from "./paths.js";

export const CONFIG_FILE = "camuaui.json";
export const STATE_FILE = ".camuaui/manifest.json";
export const managers = ["npm", "pnpm", "yarn", "bun"];
export const allDependencies = (pkg) => ({
  ...pkg.peerDependencies,
  ...pkg.devDependencies,
  ...pkg.dependencies,
});

export async function inspectProject(root) {
  const pkg = JSON.parse(await readOptional(path.join(root, "package.json")));
  const saved = await readOptional(path.join(root, CONFIG_FILE));
  const config = saved ? JSON.parse(saved) : null;
  if (config && config.schemaVersion !== 1)
    throw new Error("camuaui.json 的版本不受支持。");
  const hasSrc = await exists(path.join(root, "src"));
  const hasApp = await exists(path.join(root, "app"));
  const language = (await exists(path.join(root, "tsconfig.json")))
    ? "ts"
    : "js";
  const cssCandidates = [
    "src/app/globals.css",
    "app/globals.css",
    "src/index.css",
    "src/style.css",
    "src/styles.css",
    "src/global.css",
    "app/app.css",
    "app/tailwind.css",
    "app/styles/tailwind.css",
    "app/styles.css",
    "styles/globals.css",
    "src/styles/globals.css",
  ];
  let css = null;
  for (const candidate of cssCandidates)
    if (await exists(path.join(root, candidate))) {
      css = candidate;
      break;
    }
  const entryCandidates = [
    "src/app/layout.tsx",
    "src/app/layout.jsx",
    "src/app/layout.js",
    "app/layout.tsx",
    "app/layout.jsx",
    "app/layout.js",
    "src/main.tsx",
    "src/main.jsx",
    "src/main.js",
    "src/main.ts",
    "src/index.tsx",
    "src/index.jsx",
    "src/index.js",
    "app/root.tsx",
    "app/root.jsx",
    "src/root.tsx",
  ];
  let entry = null;
  for (const candidate of entryCandidates)
    if (await exists(path.join(root, candidate))) {
      entry = candidate;
      break;
    }
  css ??= entry?.includes("app/layout.")
    ? `${path.posix.dirname(entry)}/globals.css`
    : hasSrc
      ? "src/styles.css"
      : hasApp
        ? "app/styles.css"
        : "styles.css";
  let packageManager = pkg.packageManager?.split("@")[0];
  if (!managers.includes(packageManager)) {
    packageManager = "npm";
    for (const [lock, manager] of [
      ["pnpm-lock.yaml", "pnpm"],
      ["yarn.lock", "yarn"],
      ["bun.lock", "bun"],
      ["bun.lockb", "bun"],
    ])
      if (await exists(path.join(root, lock))) {
        packageManager = manager;
        break;
      }
  }
  const prefix = hasSrc ? "src/" : hasApp ? "app/" : "";
  return {
    root,
    pkg,
    config,
    defaults: {
      schemaVersion: 1,
      language,
      components: `${prefix}components/ui`,
      utils: `${prefix}lib/camuaui.${language === "ts" ? "ts" : "js"}`,
      styles: `${prefix}styles/camuaui`,
      css,
      entry,
      examples: false,
      examplesPath: `${prefix}components/camuaui-examples`,
      packageManager,
      configure: true,
      backup: true,
    },
  };
}

export function resolveConfig(project, options) {
  const config = { ...project.defaults, ...project.config };
  for (const key of [
    "components",
    "utils",
    "styles",
    "css",
    "entry",
    "examplesPath",
    "language",
    "packageManager",
    "examples",
    "configure",
    "backup",
  ]) {
    if (options[key] !== undefined) config[key] = options[key];
  }
  if (!["ts", "js"].includes(config.language))
    throw new Error("--language 只支持 ts 或 js。");
  if (!managers.includes(config.packageManager))
    throw new Error("不支持的包管理器。请选择 npm、pnpm、yarn 或 bun。");
  for (const key of ["examples", "configure", "backup"])
    if (typeof config[key] !== "boolean")
      throw new Error(`camuaui.json 的 ${key} 必须为布尔值。`);
  for (const key of [
    "components",
    "utils",
    "styles",
    "css",
    "examplesPath",
    "entry",
  ]) {
    if (key === "entry" && config[key] === null) continue;
    if (
      typeof config[key] !== "string" ||
      config[key].includes("\\") ||
      !config[key].trim()
    )
      throw new Error(`${key} 请使用相对于项目的路径，以 / 分隔。`);
    config[key] = path.posix.normalize(config[key]).replace(/\/$/, "");
  }
  if (!/\.(ts|js)$/.test(config.utils))
    throw new Error("utils 必须为 .ts 或 .js 文件。");
  config.utils = config.utils.replace(
    /\.(ts|js)$/,
    config.language === "js" ? ".js" : ".ts",
  );
  return config;
}

async function dependencyVersion(root, pkg, name) {
  const installed = await readOptional(
    path.join(root, "node_modules", ...name.split("/"), "package.json"),
  );
  if (installed) return JSON.parse(installed).version;
  return allDependencies(pkg)[name];
}

export async function dependencyPlan(
  root,
  pkg,
  pipelineDependencies = [],
  exampleDependencies = [],
) {
  const declared = allDependencies(pkg);
  const react = await dependencyVersion(root, pkg, "react");
  const tailwind = await dependencyVersion(root, pkg, "tailwindcss");
  const major = (value) =>
    typeof value === "string"
      ? Number(value.match(/(?:^|[\s^~>=])([0-9]+)\./)?.[1])
      : NaN;
  if (major(react) < 18)
    throw new Error("Camua UI 需要 React 18 或 19，请先升级当前项目的 React。");
  if (major(tailwind) < 4)
    throw new Error(
      "当前项目使用 Tailwind 3。请先完成 Tailwind 4 迁移，再运行 camuaui；CLI 不会悄悄改写旧版主题配置。",
    );
  const runtime = [
    ...exampleDependencies,
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "react",
    "react-dom",
  ].filter((name) => !declared[name]);
  const base = await dependencyVersion(root, pkg, "@base-ui/react");
  const baseMatch =
    typeof base === "string" ? base.match(/(?:^|[\s^~>=])(\d+)\.(\d+)/) : null;
  if (
    declared["@base-ui/react"] &&
    baseMatch &&
    (Number(baseMatch[1]) === 0 ||
      (Number(baseMatch[1]) === 1 && Number(baseMatch[2]) < 9))
  )
    runtime.push("@base-ui/react");
  const development = ["tailwindcss", ...pipelineDependencies].filter(
    (name, index, items) => !declared[name] && items.indexOf(name) === index,
  );
  const required = [
    ...exampleDependencies,
    "@base-ui/react",
    "clsx",
    "tailwind-merge",
    "react",
    "react-dom",
    "tailwindcss",
    ...pipelineDependencies,
  ];
  let needsRestore = false;
  for (const name of required)
    if (
      declared[name] &&
      !(await exists(
        path.join(root, "node_modules", ...name.split("/"), "package.json"),
      ))
    )
      needsRestore = true;
  return { runtime, development, needsRestore };
}
