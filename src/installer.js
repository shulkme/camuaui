import path from "node:path";
import { readFile } from "node:fs/promises";
import { projectRoot, projectPath, readOptional, posix } from "./paths.js";
import {
  CONFIG_FILE,
  STATE_FILE,
  inspectProject,
  resolveConfig,
  dependencyPlan,
} from "./project.js";
import {
  readRegistry,
  registryWrites,
  digest,
  packageRoot,
} from "./registry.js";
import { planCss, planPipeline } from "./css.js";
import { installCommands, runInstall } from "./install.js";
import { commitFiles } from "./transaction.js";

export async function synchronize(options = {}, services = {}) {
  const root = await projectRoot(options.cwd ?? process.cwd());
  const project = await inspectProject(root);
  const config = resolveConfig(project, options);
  for (const key of ["components", "utils", "styles", "css", "examplesPath"])
    await projectPath(root, config[key]);
  if (config.entry) await projectPath(root, config.entry);
  await projectPath(root, STATE_FILE, { internal: true });
  const previousSource = await readOptional(path.join(root, STATE_FILE));
  const previous = previousSource ? JSON.parse(previousSource) : { files: [] };
  if (!Array.isArray(previous.files))
    throw new Error(".camuaui/manifest.json 格式无效。");
  const previousConfig = previous.config ?? project.config;
  const registry = await readRegistry();
  const pkg = structuredClone(project.pkg);
  const writes = await registryWrites(config, root, registry);
  const managed = [...writes.keys()];
  for (const owned of [config.css, config.entry, "package.json", CONFIG_FILE]) {
    if (owned && managed.includes(owned))
      throw new Error(`组件输出不能覆盖项目入口或配置：${owned}`);
  }
  if (new Set(managed).size !== managed.length)
    throw new Error("组件、工具和样式的输出路径存在冲突。");
  const pipeline = await planPipeline(root, pkg, config.configure);
  const css = await planCss(root, config, previousConfig);
  const dependencies = await dependencyPlan(
    root,
    pkg,
    pipeline.dependencies,
    config.examples ? ["@tanstack/react-virtual"] : [],
  );
  const commands = installCommands(config.packageManager, dependencies);
  for (const [file, content] of [...pipeline.writes, ...css.writes]) {
    if (writes.has(file))
      throw new Error(`集成配置与组件输出路径冲突：${file}`);
    writes.set(file, content);
  }
  for (const file of writes.keys()) await projectPath(root, file);
  for (const item of previous.files) {
    const owned = previousConfig;
    const allowed =
      owned &&
      typeof item.path === "string" &&
      (item.path === owned.utils ||
        [owned.components, owned.styles, owned.examplesPath].some(
          (directory) => directory && item.path.startsWith(`${directory}/`),
        ));
    if (
      !allowed ||
      path.posix.normalize(item.path) !== item.path ||
      !/^[a-f0-9]{64}$/.test(item.sha256 ?? "") ||
      [config.css, config.entry, "package.json", CONFIG_FILE].includes(
        item.path,
      )
    )
      throw new Error(".camuaui/manifest.json 含非受管理文件，请先检查配置。");
  }
  const removals = previous.files
    .map((item) => item.path)
    .filter((file) => !managed.includes(file));
  for (const file of removals) await projectPath(root, file);
  // The only package fields this CLI owns are its new script and an explicitly
  // planned PostCSS plugin. Re-read after npm so newly installed versions survive.
  const packageInfo = JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8"),
  );
  const command = `npx --yes ${packageInfo.name}@latest`;
  let script = project.config?.script ?? "ui";
  if (
    pkg.scripts?.[script] &&
    !pkg.scripts[script].includes(`${packageInfo.name}@latest`)
  ) {
    script = "ui:sync";
    let suffix = 2;
    while (
      pkg.scripts?.[script] &&
      !pkg.scripts[script].includes(`${packageInfo.name}@latest`)
    )
      script = `ui:sync:${suffix++}`;
  }
  config.script = script;
  const warnings = [...pipeline.warnings, ...css.warnings];
  const previouslyInstalled = new Set(previous.files.map((file) => file.path));
  const hadComponent = (name) => ["tsx", "jsx"].some((extension) =>
    previouslyInstalled.has(`${previousConfig?.components}/${name}.${extension}`),
  );
  if (
    previousConfig?.components &&
    hadComponent("dialog") && !hadComponent("modal")
  )
    warnings.push("弹窗 API 已调整：普通弹窗由 Dialog* 改为 Modal*（从 modal 文件导入）；新的 Dialog 基于 AlertDialog，用于操作确认。请手动更新业务代码中的导入和组件名称。");
  if (options.skipInstall && commands.length)
    warnings.push("已跳过依赖安装。使用组件前请安装计划中缺失的依赖。");
  const plan = {
    root,
    config,
    version: registry.version,
    files: [
      ...new Set([...writes.keys(), "package.json", CONFIG_FILE, STATE_FILE]),
    ],
    removals,
    commands,
    warnings,
  };
  if (services.onPlan && !(await services.onPlan(plan)))
    return { ...plan, canceled: true };
  if (options.dryRun) return { ...plan, dryRun: true };
  if (!options.skipInstall)
    await (services.install ?? runInstall)(root, commands);
  const currentPkg = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  );
  currentPkg.scripts = { ...currentPkg.scripts, [script]: command };
  if (
    pkg.postcss &&
    JSON.stringify(pkg.postcss) !== JSON.stringify(project.pkg.postcss)
  )
    currentPkg.postcss = pkg.postcss;
  writes.set("package.json", `${JSON.stringify(currentPkg, null, 2)}\n`);
  writes.set(CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`);
  writes.set(
    STATE_FILE,
    `${JSON.stringify({ schemaVersion: 1, version: registry.version, config, files: managed.map((file) => ({ path: file, sha256: digest(writes.get(file)) })) }, null, 2)}\n`,
  );
  await services.onProgress?.("write");
  const result = await commitFiles(root, writes, removals, {
    backup: config.backup,
  });
  return {
    ...plan,
    ...result,
    backupPath: result.backupPath
      ? posix(path.relative(root, result.backupPath))
      : null,
  };
}
