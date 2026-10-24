import { parseArgs } from "node:util";
import { createInterface } from "node:readline/promises";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { packageRoot, readRegistry } from "./registry.js";
import { projectRoot } from "./paths.js";
import { inspectProject, resolveConfig } from "./project.js";
import { synchronize } from "./installer.js";
import { runInstall } from "./install.js";
import { createReporter } from "./reporter.js";

export function reportError(error) {
  createReporter({ log: console.error, stream: process.stderr }).error(`Camua UI: ${error.message}`);
  if (process.env.CAMUAUI_DEBUG) console.error(error.stack);
  process.exitCode = 1;
}

const help = `Camua UI — 将 React 组件源码复制到你的项目\n\n用法：\n  npx camuaui@latest [init|update] [选项]\n  npx camuaui@latest list\n  npm create camuaui@latest app-name\n\n重复执行会覆盖组件和主题，默认先备份旧文件，不清理其他项目文件。\n\n选项：\n  -y, --yes                 使用默认/已有配置，不显示交互\n  --cwd <目录>             目标 React 项目根目录\n  --components <目录>      组件目录\n  --utils <文件>           cn 工具文件路径\n  --styles <目录>          主题/动效样式目录\n  --css <文件>             全局 CSS 入口\n  --entry <文件>           引入全局 CSS 的 React 入口模块\n  --language <ts|js>       TypeScript 或 JavaScript/JSX\n  --package-manager <名称> npm、pnpm、yarn、bun\n  --examples               添加 DesignSystem 示例组件\n  --no-examples            不添加示例，清理先前受管理的示例文件\n  --examples-path <目录>   示例目录\n  --skip-install           只复制，不安装缺失依赖\n  --no-configure           不修改构建配置、CSS 入口与入口模块\n  --no-backup              覆盖前不备份\n  --dry-run                查看计划，不写文件、不安装依赖\n  -h, --help               查看帮助\n  -v, --version            查看版本\n`;

export const cliOptions = {
      yes: { type: "boolean", short: "y" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      cwd: { type: "string" },
      components: { type: "string" },
      utils: { type: "string" },
      styles: { type: "string" },
      css: { type: "string" },
      entry: { type: "string" },
      language: { type: "string" },
      "package-manager": { type: "string" },
      "examples-path": { type: "string" },
      examples: { type: "boolean" },
      "no-examples": { type: "boolean" },
      "skip-install": { type: "boolean" },
      "no-configure": { type: "boolean" },
      "no-backup": { type: "boolean" },
      "dry-run": { type: "boolean" },
};

export function parseOptions(args) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: cliOptions,
  });
  const command = positionals[0] ?? "init";
  if (
    positionals.length > 1 ||
    !["init", "update", "sync", "list"].includes(command)
  )
    throw new Error("未知命令。使用 --help 查看用法。");
  if (values.examples && values["no-examples"])
    throw new Error("--examples 和 --no-examples 不能同时使用。");
  return {
    ...values,
    command,
    examples: values["no-examples"] ? false : values.examples,
    examplesPath: values["examples-path"],
    packageManager: values["package-manager"],
    skipInstall: values["skip-install"],
    dryRun: values["dry-run"],
    configure: values["no-configure"] ? false : undefined,
    backup: values["no-backup"] ? false : undefined,
  };
}

export async function main(args = process.argv.slice(2), services = {}) {
  // Keep existing-project options in one parser; the creator owns scaffolding.
  if (!args.includes("--help") && !args.includes("-h") && !args.includes("--version") && !args.includes("-v")) {
    const first = args[0];
    const cwdIndex = args.indexOf("--cwd");
    const cwd = cwdIndex >= 0 ? args[cwdIndex + 1] : args.find(arg => arg.startsWith("--cwd="))?.slice(6) ?? process.cwd();
    const hasPackage = await readFile(path.join(cwd ?? process.cwd(), "package.json"), "utf8").then(() => true, error => {
      if (error.code === "ENOENT") return false;
      throw error;
    });
    if (args.some(arg => arg === "--framework" || arg.startsWith("--framework=")) ||
      (first && !first.startsWith("-") && !["init", "update", "sync", "list"].includes(first)) ||
      (!hasPackage && !["update", "sync", "list"].includes(first))) {
      const { createMain } = await import("./create.js");
      return createMain(first === "init" ? args.slice(1) : args, services);
    }
  }
  const options = parseOptions(args);
  const log = services.log ?? console.log;
  const reporter = createReporter({ log, color: services.color });
  if (options.help) {
    reporter.help(help);
    return;
  }
  if (options.version) {
    log(
      JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"))
        .version,
    );
    return;
  }
  if (options.command === "list") {
    log((await readRegistry()).components.join("\n"));
    return;
  }
  const version = JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8"),
  ).version;
  reporter.intro(version);
  const interactive =
    services.interactive ??
    (process.stdin.isTTY && process.stdout.isTTY && !options.yes);
  let readline;
  const prompt =
    services.ask ??
    (async (question) => {
      readline ??= createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      return readline.question(question);
    });
  const ask = (question) => prompt(reporter.question(question));
  try {
    if (interactive) {
      const project = await inspectProject(
        await projectRoot(options.cwd ?? process.cwd()),
      );
      const defaults = resolveConfig(project, options);
      reporter.step(project.config ? "读取已有安装配置" : "配置组件安装");
      if (!project.config) {
        options.components ??=
          (await ask(`组件源码目录 [${defaults.components}]：`)).trim() ||
          defaults.components;
        options.css ??=
          (await ask(`全局 CSS 入口 [${defaults.css}]：`)).trim() ||
          defaults.css;
        options.language ??=
          (await ask(`源码语言 ts/js [${defaults.language}]：`)).trim() ||
          defaults.language;
        options.packageManager ??=
          (
            await ask(
              `包管理器 npm/pnpm/yarn/bun [${defaults.packageManager}]：`,
            )
          ).trim() || defaults.packageManager;
        if (options.examples === undefined)
          options.examples = /^(y|yes|是)$/i.test(
            (await ask("是否添加 DesignSystem 示例组件？[y/N]：")).trim(),
          );
      }
    }
    const result = await synchronize(options, {
      install: async (root, commands) => {
        if (!commands.length) {
          reporter.success("依赖已就绪，无需安装。");
          return;
        }
        reporter.step("安装项目依赖");
        reporter.note("以下为包管理器输出；警告是否影响安装以退出结果为准。");
        await (services.install ?? runInstall)(root, commands);
        reporter.success("依赖安装完成。");
      },
      onProgress: (phase) => {
        if (phase === "write") reporter.step("写入组件、样式与配置");
      },
      onPlan: async (plan) => {
        reporter.section(options.dryRun ? "预览同步计划" : "同步计划");
        reporter.detail("目标", plan.root);
        reporter.detail("版本", plan.version);
        reporter.detail("组件", plan.config.components);
        reporter.detail("样式", plan.config.styles);
        reporter.detail("示例", plan.config.examples ? plan.config.examplesPath : "不添加");
        reporter.info(
          `将同步 ${plan.files.length} 个文件${plan.removals.length ? `，清理 ${plan.removals.length} 个旧文件` : ""}。`,
        );
        for (const { command, args: commandArgs } of plan.commands)
          reporter.command(`${command} ${commandArgs.join(" ")}`);
        for (const warning of plan.warnings) reporter.warn(warning);
        if (options.dryRun) {
          for (const file of plan.files) reporter.note(`写入 ${file}`);
          for (const file of plan.removals) reporter.note(`移除 ${file}`);
          return true;
        }
        if (!interactive) return true;
        return !/^(n|no|否)$/i.test(
          (await ask("开始同步并覆盖上述源码？[Y/n]：")).trim(),
        );
      },
    });
    if (result.canceled) {
      reporter.warn("已取消，项目文件未修改。");
      return result;
    }
    if (result.dryRun) {
      reporter.success("预览完成，未写文件或安装依赖。");
      return result;
    }
    reporter.success(
      `已同步 ${result.changed.length} 个文件，移除 ${result.removed.length} 个旧文件。`,
    );
    if (result.backupPath) reporter.detail("旧文件备份", result.backupPath);
    reporter.section("接下来");
    reporter.detail("CSS 入口", result.config.css);
    reporter.info(`请在根组件使用 ${result.config.components}/provider 中的 UIProvider。`);
    if (result.config.examples)
      reporter.info(
        `示例组件：${result.config.examplesPath}/index.${result.config.language === "ts" ? "tsx" : "jsx"}，导出 DesignSystem。`,
      );
    reporter.note("更新组件时执行：");
    reporter.command(`npm run ${result.config.script}  或  npx camuaui@latest update`);
    return result;
  } finally {
    readline?.close();
  }
}
