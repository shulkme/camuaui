import { parseArgs } from "node:util";
import { createInterface } from "node:readline/promises";
import { readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import spawn from "cross-spawn";
import { cliOptions, main as installMain } from "./cli.js";
import { exists, projectPath, readOptional, relativeImport } from "./paths.js";
import { packageRoot } from "./registry.js";
import { managers } from "./project.js";
import { synchronize } from "./installer.js";
import { commitFiles } from "./transaction.js";
import { createReporter } from "./reporter.js";

const help = `Camua UI — 创建 React 项目或安装到已有项目

用法：
  npm create camuaui@latest app-name
  npm create camuaui@latest
  npm create camuaui@latest . -- --framework vite

选项：
  --framework <next|vite|existing>  选择框架；existing 跳过创建
  --language <ts|js>               源码语言，默认 ts
  --package-manager <名称>        npm、pnpm、yarn、bun
  --examples / --no-examples       新项目默认接入示例首页
  --cwd <目录>                    工作目录
  -y, --yes                       跳过交互，新项目默认 Vite
  --dry-run                       只查看计划，不运行脚手架或写文件
  --skip-install                  创建源码但不安装项目依赖
  -h, --help                      查看帮助

检测到 React 项目时自动安装组件，保留已有页面；安装参数见 npx camuaui@latest --help。
`;

export function frameworkCommand(framework, name, language, manager) {
  const args = framework === "next"
    ? ["create-next-app@latest", name, "--yes", language === "js" ? "--js" : "--ts", "--tailwind", "--eslint", "--app", "--src-dir", "--import-alias", "@/*", `--use-${manager}`, "--skip-install", "--disable-git", "--no-react-compiler", "--no-cache-components", "--no-agent-feedback", "--no-agents-md"]
    : ["create-vite@latest", name, "--template", language === "js" ? "react" : "react-ts", "--no-interactive", "--no-immediate"];
  return { command: "npm", args: ["exec", "--yes", "--", ...args] };
}

export async function runScaffold(cwd, command) {
  await new Promise((resolve, reject) => {
    const child = spawn(command.command, command.args, {
      cwd, stdio: "inherit", windowsHide: true,
      env: { ...process.env, CI: "1", npm_config_yes: "true", NEXT_TELEMETRY_DISABLED: "1" },
    });
    child.on("error", reject);
    child.on("close", (code, signal) => code === 0 ? resolve() : reject(new Error(`框架脚手架失败（${signal ?? code}）。已生成的目录会保留，请检查输出。`)));
  });
}

function installArgs(values, target) {
  const args = ["--cwd", target];
  for (const [key, value] of Object.entries(values)) {
    if (["cwd", "framework", "help", "version"].includes(key) || value === undefined || value === false) continue;
    args.push(`--${key}`);
    if (typeof value === "string") args.push(value);
  }
  return args;
}

async function starterFiles(target, framework, config) {
  const extension = config.language === "ts" ? "tsx" : "jsx";
  const templateFile = async stem => {
    for (const suffix of config.language === "ts" ? ["tsx"] : ["jsx", "js"]) {
      const candidate = `${stem}.${suffix}`;
      if (await exists(path.join(target, candidate))) return candidate;
    }
    throw new Error(`框架模板布局已变化，找不到 ${stem} 的入口文件。`);
  };
  const entry = await templateFile(framework === "next" ? "src/app/layout" : "src/main");
  const page = await templateFile(framework === "next" ? "src/app/page" : "src/App");
  for (const file of [entry, page, config.css]) {
    await projectPath(target, file);
    if (!(await exists(path.join(target, file)))) throw new Error(`框架模板布局已变化，缺少 ${file}，请手动接入 UIProvider 和首页。`);
  }
  const module = (from, to) => JSON.stringify(relativeImport(from, to).replace(/\.(tsx?|jsx?)$/, ""));
  const content = config.examples
    ? `import { DesignSystem } from ${module(page, `${config.examplesPath}/index.${extension}`)};\nexport default function App() { return <DesignSystem />; }\n`
    : `import { Button } from ${module(page, `${config.components}/button.${extension}`)};\nexport default function App() { return <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-start justify-center gap-4 p-6"><h1 className="text-title font-semibold">开始构建你的界面</h1><p className="text-secondary">组件和主题已就绪。</p><Button>开始使用</Button></main>; }\n`;
  const provider = module(entry, `${config.components}/provider.${extension}`);
  const css = module(entry, config.css);
  const layout = framework === "next"
    ? `import ${css};\nimport { UIProvider } from ${provider};\nexport default function RootLayout({ children }${config.language === "ts" ? ": { children: React.ReactNode }" : ""}) { return <html lang="zh-CN"><body><UIProvider>{children}</UIProvider></body></html>; }\n`
    : `import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\nimport ${css};\nimport { UIProvider } from ${provider};\ncreateRoot(document.getElementById("root")${config.language === "ts" ? "!" : ""}).render(<StrictMode><UIProvider><App /></UIProvider></StrictMode>);\n`;
  const stylesheet = `@import "tailwindcss";\n@import ${JSON.stringify(relativeImport(config.css, `${config.styles}/index.css`))};\n`;
  return new Map([[entry, layout], [page, content], [config.css, stylesheet]]);
}

export async function createMain(args = process.argv.slice(2), services = {}) {
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: { ...cliOptions, framework: { type: "string" } } });
  if (positionals.length > 1) throw new Error("只接受一个项目目录名。");
  const reporter = createReporter({ log: services.log, color: services.color });
  if (values.help) { reporter.help(help); return; }
  const pkg = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
  if (values.version) { (services.log ?? console.log)(pkg.version); return; }
  if (values.examples && values["no-examples"]) throw new Error("--examples 和 --no-examples 不能同时使用。");
  let framework = values.framework;
  if (framework === "next.js") framework = "next";
  if (framework === "none" || framework === "skip") framework = "existing";
  if (framework && !["next", "vite", "existing"].includes(framework)) throw new Error("--framework 只支持 next、vite、existing。");
  const cwd = await realpath(path.resolve(values.cwd ?? process.cwd()));
  let name = positionals[0];
  const validateName = (value) => {
    if (value !== "." && (!/^[a-z0-9][a-z0-9._-]*$/.test(value) || ["node_modules"].includes(value))) throw new Error("项目名请使用小写字母、数字、连字符，或使用 . 表示当前目录。");
  };
  if (name) validateName(name);
  let target = name && name !== "." ? await projectPath(cwd, name) : cwd;
  const packagePath = await projectPath(target, "package.json");
  const existingSource = await readOptional(packagePath);
  const existing = existingSource ? JSON.parse(existingSource) : null;
  const dependencies = { ...existing?.peerDependencies, ...existing?.devDependencies, ...existing?.dependencies };
  if (framework === "existing" || (!framework && dependencies.react)) {
    if (!existing && name && name !== "." && await readOptional(await projectPath(cwd, "package.json"))) {
      reporter.info("跳过框架，使用当前项目目录安装组件。");
      return installMain(installArgs(values, cwd), services);
    }
    if (!existing) throw new Error("跳过框架需要目标目录已有 package.json，请先创建 React 项目。");
    reporter.info(`检测到已有 ${dependencies.next ? "Next.js" : dependencies.vite ? "Vite" : "React"} 项目，直接安装组件。`);
    return installMain(installArgs(values, target), services);
  }
  if (existing) throw new Error("目标已有 package.json。请使用 --framework existing 安装组件，或选择新的空目录。");
  reporter.intro(pkg.version);
  const interactive = services.interactive ?? (process.stdin.isTTY && process.stdout.isTTY && !values.yes);
  let readline;
  const ask = async message => (services.ask ?? (question => {
    readline ??= createInterface({ input: process.stdin, output: process.stdout });
    return readline.question(question);
  }))(reporter.question(message));
  try {
    if (!framework) {
      if (!interactive && !values.yes) throw new Error("请在交互终端选择框架，或指定 --framework next|vite（--yes 默认 Vite）。");
      const choice = interactive ? (await ask("选择框架：1) Next.js  2) Vite + React  3) 跳过框架 [2]：")).trim().toLowerCase() : "2";
      const choices = { "1": "next", "next": "next", "next.js": "next", "": "vite", "2": "vite", "vite": "vite", "3": "existing", "existing": "existing" };
      framework = Object.hasOwn(choices, choice) ? choices[choice] : undefined;
      if (!framework) throw new Error("请选择 Next.js、Vite 或跳过框架。");
      if (framework === "existing") {
        if (await readOptional(await projectPath(cwd, "package.json"))) {
          reporter.info("跳过框架，使用当前项目目录安装组件。");
          return installMain(installArgs(values, cwd), services);
        }
        throw new Error("当前目录没有 package.json，无法跳过框架。请在已有项目目录中执行。");
      }
    }
    if (!name) {
      name = interactive ? (await ask("项目目录名（. 为当前空目录）[camuaui-app]：")).trim() || "camuaui-app" : "camuaui-app";
      validateName(name);
      target = name === "." ? cwd : await projectPath(cwd, name);
    }
    if (await exists(target)) {
      const entries = await readdir(target);
      if (entries.length) throw new Error("创建项目需要空目录，不会覆盖已有文件。请换一个目录名。");
    }
    const language = values.language ?? (interactive ? (await ask("源码语言 ts/js [ts]：")).trim() || "ts" : "ts");
    const detectedManager = process.env.npm_config_user_agent?.split("/")[0];
    const defaultManager = managers.includes(detectedManager) ? detectedManager : "npm";
    const manager = values["package-manager"] ?? (interactive ? (await ask(`包管理器 npm/pnpm/yarn/bun [${defaultManager}]：`)).trim() || defaultManager : defaultManager);
    if (!["ts", "js"].includes(language) || !managers.includes(manager)) throw new Error("请指定有效的源码语言（ts/js）和包管理器。");
    const examples = values["no-examples"] ? false : values.examples ?? (interactive ? !/^(n|no|否)$/i.test((await ask("是否将组件示例作为首页？[Y/n]：")).trim()) : true);
    for (const key of ["components", "utils", "styles", "examples-path", "css", "entry", "no-configure", "no-backup"]) {
      if (values[key] !== undefined) throw new Error(`新项目创建暂不支持 --${key}，可在创建后使用组件安装命令自定义路径。`);
    }
    const command = frameworkCommand(framework, name, language, manager);
    reporter.section("创建计划"); reporter.detail("目录", target); reporter.detail("框架", framework === "next" ? "Next.js App Router" : "Vite + React");
    reporter.detail("语言", language); reporter.detail("包管理器", manager); reporter.detail("首页", examples ? "组件示例" : "简洁首页");
    reporter.command(`${command.command} ${command.args.join(" ")}`);
    if (values["dry-run"]) { reporter.success("预览完成，未运行脚手架、安装依赖或写文件。"); return { dryRun: true, target, framework, command }; }
    reporter.step("创建最新框架项目");
    await (services.scaffold ?? runScaffold)(cwd, command);
    const generatedPackagePath = await projectPath(target, "package.json");
    const generated = JSON.parse(await readFile(generatedPackagePath, "utf8"));
    if (!generated.dependencies?.react || (framework === "next" && !generated.dependencies.next) || (framework === "vite" && !generated.devDependencies?.vite)) throw new Error("脚手架没有生成预期的 React 项目，已停止组件安装。");
    for (const section of ["dependencies", "devDependencies"]) {
      for (const key of Object.keys(generated[section] ?? {})) {
        if (["react", "react-dom", "next", "vite", "@vitejs/plugin-react", "tailwindcss", "@tailwindcss/postcss"].includes(key)) generated[section][key] = "latest";
      }
    }
    // Declare the complete starter dependencies up front: one install restores
    // both the framework and UI, and --skip-install still yields a usable app.
    generated.dependencies = {
      ...generated.dependencies,
      "@base-ui/react": "latest", clsx: "latest", "tailwind-merge": "latest",
      ...(examples ? { "@tanstack/react-virtual": "latest" } : {}),
    };
    generated.devDependencies = {
      ...generated.devDependencies,
      tailwindcss: "latest", "@tailwindcss/postcss": "latest", postcss: "latest",
    };
    await commitFiles(target, new Map([["package.json", `${JSON.stringify(generated, null, 2)}\n`]]), [], { backup: false });
    reporter.step("安装依赖并接入 Camua UI");
    const result = await synchronize({ cwd: target, language, packageManager: manager, examples, skipInstall: values["skip-install"] }, {
      ...(services.install ? { install: services.install } : {}),
      onPlan: plan => { for (const warning of plan.warnings) reporter.warn(warning); return true; },
    });
    const writes = await starterFiles(target, framework, result.config);
    await commitFiles(target, writes, [], { backup: false });
    reporter.success("项目已创建，首页已接入 UIProvider、主题和组件。");
    reporter.section("启动项目");
    if (target !== path.resolve(process.cwd())) reporter.command(`cd ${JSON.stringify(path.relative(process.cwd(), target))}`);
    if (values["skip-install"]) reporter.command(`${manager} install`);
    reporter.command(manager === "npm" ? "npm run dev" : `${manager} dev`);
    return { ...result, framework, target };
  } finally { readline?.close(); }
}

export function reportCreateError(error) {
  createReporter({ log: console.error, stream: process.stderr }).error(`Camua UI: ${error.message}`);
  if (process.env.CAMUAUI_DEBUG) console.error(error.stack);
  process.exitCode = 1;
}
