import path from "node:path";
import ts from "typescript";
import { readOptional, relativeImport, exists, projectPath } from "./paths.js";

const postcssNames = [
  "postcss.config.mjs",
  "postcss.config.cjs",
  "postcss.config.js",
  "postcss.config.ts",
  "postcss.config.mts",
  "postcss.config.cts",
  ".postcssrc",
  ".postcssrc.json",
  ".postcssrc.js",
  ".postcssrc.cjs",
  ".postcssrc.yml",
  ".postcssrc.yaml",
];
const buildConfigNames = [
  "vite.config.ts",
  "vite.config.js",
  "vite.config.mts",
  "vite.config.mjs",
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
];

function importedPackages(source) {
  const sf = ts.createSourceFile(
    "config.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const packages = new Set();
  function visit(node) {
    if (ts.isStringLiteral(node) && node.text.startsWith("@tailwindcss/"))
      packages.add(node.text);
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return packages;
}

export function addPostcssPlugin(source, filename) {
  const sf = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  let object;
  for (const statement of sf.statements) {
    if (
      ts.isExportAssignment(statement) &&
      ts.isObjectLiteralExpression(statement.expression)
    )
      object = statement.expression;
    if (
      ts.isExpressionStatement(statement) &&
      ts.isBinaryExpression(statement.expression) &&
      statement.expression.left.getText(sf) === "module.exports" &&
      ts.isObjectLiteralExpression(statement.expression.right)
    )
      object = statement.expression.right;
  }
  if (!object)
    throw new Error(
      `无法安全修改 ${filename}：请手动添加 @tailwindcss/postcss，或使用 --no-configure 仅下载源码。`,
    );
  const plugin = object.properties.find(
    (node) =>
      node.name && node.name.getText(sf).replace(/["']/g, "") === "plugins",
  );
  if (!plugin)
    return (
      source.slice(0, object.getStart(sf) + 1) +
      '\n  plugins: { "@tailwindcss/postcss": {} },' +
      source.slice(object.getStart(sf) + 1)
    );
  if (!ts.isPropertyAssignment(plugin))
    throw new Error(
      `无法安全修改 ${filename} 的 plugins，请手动添加 @tailwindcss/postcss 或使用 --no-configure。`,
    );
  const initializer = plugin.initializer;
  if (ts.isObjectLiteralExpression(initializer)) {
    const offset = initializer.getStart(sf) + 1;
    return (
      source.slice(0, offset) +
      '\n    "@tailwindcss/postcss": {},' +
      source.slice(offset)
    );
  }
  if (ts.isArrayLiteralExpression(initializer)) {
    let binding = "camuauiTailwindPostcss";
    while (new RegExp(`\\b${binding}\\b`).test(source)) binding += "_";
    const offset = initializer.getStart(sf) + 1;
    const patched =
      source.slice(0, offset) + `${binding}(), ` + source.slice(offset);
    const esm =
      filename.endsWith(".mjs") ||
      filename.endsWith(".mts") ||
      sf.statements.some(ts.isExportAssignment);
    return (
      (esm
        ? `import ${binding} from "@tailwindcss/postcss";\n`
        : `const ${binding} = require("@tailwindcss/postcss");\n`) + patched
    );
  }
  throw new Error(
    `无法安全修改 ${filename} 的动态 plugins，请手动配置或使用 --no-configure。`,
  );
}

export async function planPipeline(root, pkg, configure) {
  if (!configure)
    return {
      writes: new Map(),
      dependencies: [],
      warnings: ["已跳过 CSS 构建配置。请确保现有构建工具已启用 Tailwind 4。"],
    };
  const configured = new Set();
  const postcssFiles = [];
  for (const name of [...postcssNames, ...buildConfigNames]) {
    const source = await readOptional(path.join(root, name));
    if (source === null) continue;
    for (const item of importedPackages(source)) configured.add(item);
    if (postcssNames.includes(name)) postcssFiles.push({ name, source });
  }
  if (pkg.postcss)
    for (const key of Object.keys(pkg.postcss.plugins ?? {}))
      configured.add(key);
  if (configured.has("@tailwindcss/vite"))
    return {
      writes: new Map(),
      dependencies: ["@tailwindcss/vite"],
      warnings: [],
    };
  if (configured.has("@tailwindcss/turbopack"))
    return {
      writes: new Map(),
      dependencies: ["@tailwindcss/turbopack"],
      warnings: [],
    };
  if (configured.has("@tailwindcss/postcss"))
    return {
      writes: new Map(),
      dependencies: ["@tailwindcss/postcss", "postcss"],
      warnings: [],
    };
  if (postcssFiles.length > 1)
    throw new Error(
      "发现多份 PostCSS 配置，请先明确实际使用的配置，或使用 --no-configure。",
    );
  const writes = new Map();
  if (pkg.postcss && postcssFiles.length)
    throw new Error(
      "package.json 和文件中均有 PostCSS 配置，请先保留一份或使用 --no-configure。",
    );
  if (pkg.postcss) {
    if (
      !pkg.postcss.plugins ||
      Array.isArray(pkg.postcss.plugins) ||
      typeof pkg.postcss.plugins !== "object"
    )
      throw new Error(
        "package.json 的 PostCSS plugins 必须为对象，请手动配置或使用 --no-configure。",
      );
    pkg.postcss.plugins["@tailwindcss/postcss"] = {};
  } else if (!postcssFiles.length) {
    writes.set(
      "postcss.config.mjs",
      'export default {\n  plugins: { "@tailwindcss/postcss": {} },\n};\n',
    );
  } else {
    const { name, source } = postcssFiles[0];
    if (name.endsWith(".json") || name === ".postcssrc") {
      const json = JSON.parse(source);
      if (
        json.plugins &&
        (typeof json.plugins !== "object" || Array.isArray(json.plugins))
      )
        throw new Error(`${name} 的 plugins 必须为对象。`);
      json.plugins = { "@tailwindcss/postcss": {}, ...json.plugins };
      writes.set(name, `${JSON.stringify(json, null, 2)}\n`);
    } else if (/\.ya?ml$/.test(name))
      throw new Error(
        `请手动在 ${name} 中添加 @tailwindcss/postcss，或使用 --no-configure。`,
      );
    else writes.set(name, addPostcssPlugin(source, name));
  }
  return {
    writes,
    dependencies: ["@tailwindcss/postcss", "postcss"],
    warnings: [],
  };
}

const removeComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
async function hasTailwindImport(root, filename, seen = new Set()) {
  if (seen.has(filename) || seen.size >= 30) return false;
  seen.add(filename);
  const source = removeComments((await readOptional(filename)) ?? "");
  if (/@import\s+(?:url\(\s*)?["']tailwindcss(?:["'/])/.test(source))
    return true;
  for (const match of source.matchAll(/@import\s+["'](\.[^"']+)["']/g)) {
    const child = path.resolve(path.dirname(filename), match[1]);
    const relative = path.relative(root, child);
    if (
      !relative.startsWith("..") &&
      !path.isAbsolute(relative) &&
      (await hasTailwindImport(root, child, seen))
    )
      return true;
  }
  return false;
}

export async function planCss(root, config, previousConfig) {
  const writes = new Map();
  const warnings = [];
  if (!config.configure) return { writes, warnings };
  const filename = await projectPath(root, config.css);
  let existing = (await readOptional(filename)) ?? "";
  if (
    previousConfig?.styles &&
    previousConfig?.css &&
    (previousConfig.styles !== config.styles ||
      previousConfig.css !== config.css)
  ) {
    const oldFile = await projectPath(root, previousConfig.css);
    const oldImport = relativeImport(
      oldFile,
      path.join(root, previousConfig.styles, "index.css"),
    );
    const oldSource = (await readOptional(oldFile)) ?? "";
    const cleaned = oldSource.replace(
      /@import\s+["']([^"']+)["']\s*;[\r\n]*/g,
      (match, specifier) => (specifier === oldImport ? "" : match),
    );
    if (oldFile === filename) existing = cleaned;
    else if (cleaned !== oldSource) writes.set(previousConfig.css, cleaned);
  }
  if (
    /@tailwind\s+(base|components|utilities)\s*;/.test(removeComments(existing))
  )
    throw new Error(
      `${config.css} 含 Tailwind 3 指令，请先迁移为 Tailwind 4。`,
    );
  const generatedImport = `@import ${JSON.stringify(relativeImport(filename, path.join(root, config.styles, "index.css")))};`;
  const imports = [];
  if (!(await hasTailwindImport(root, filename)))
    imports.push('@import "tailwindcss";');
  const intended = relativeImport(
    filename,
    path.join(root, config.styles, "index.css"),
  );
  const present = [
    ...removeComments(existing).matchAll(/@import\s+["']([^"']+)["']/g),
  ].some((match) => match[1] === intended);
  if (!present) imports.push(generatedImport);
  if (imports.length) {
    const charset =
      existing.match(/^(?:\uFEFF)?\s*@charset\s+[^;]+;\s*/)?.[0] ?? "";
    writes.set(
      config.css,
      charset + imports.join("\n") + "\n" + existing.slice(charset.length),
    );
  } else if (existing !== ((await readOptional(filename)) ?? ""))
    writes.set(config.css, existing);
  if (!config.entry) warnings.push(`请在应用的全局入口引入 ${config.css}。`);
  else {
    const entry = await projectPath(root, config.entry);
    const source = await readOptional(entry);
    if (source === null)
      throw new Error(`找不到 CSS 入口模块：${config.entry}`);
    const sf = ts.createSourceFile(
      config.entry,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    let importsCss = false;
    for (const statement of sf.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier)
      )
        continue;
      const specifier = statement.moduleSpecifier.text.split("?")[0];
      if (
        specifier.startsWith(".") &&
        path.resolve(path.dirname(entry), specifier) === filename
      )
        importsCss = true;
    }
    if (!importsCss) {
      const declaration = `import ${JSON.stringify(relativeImport(entry, filename))};\n`;
      const first = sf.statements[0];
      const offset =
        first &&
        ts.isExpressionStatement(first) &&
        ts.isStringLiteral(first.expression)
          ? first.end
          : 0;
      writes.set(
        config.entry,
        source.slice(0, offset) +
          (offset ? "\n" : "") +
          declaration +
          source.slice(offset),
      );
    }
  }
  return { writes, warnings };
}
