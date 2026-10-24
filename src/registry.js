import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { posix, relativeImport } from "./paths.js";

export const packageRoot = fileURLToPath(new URL("../", import.meta.url));
export const registryRoot = path.join(packageRoot, "registry");
export const digest = (value) =>
  createHash("sha256").update(value).digest("hex");
export async function readRegistry() {
  const metadata = JSON.parse(
    await readFile(path.join(registryRoot, "registry.json"), "utf8"),
  );
  if (metadata.schemaVersion !== 1 || !Array.isArray(metadata.files))
    throw new Error("组件注册表版本不受支持。");
  return metadata;
}

export function destinationFor(file, config) {
  if (file.startsWith("components/ui/"))
    return `${config.components}/${file.slice("components/ui/".length)}`;
  if (file === "lib/utils.ts") return config.utils;
  if (file.startsWith("styles/"))
    return `${config.styles}/${file.slice("styles/".length)}`;
  if (file.startsWith("examples/design-system/"))
    return `${config.examplesPath}/${file.slice("examples/design-system/".length)}`;
  throw new Error(`注册表内有未知文件：${file}`);
}

export function outputExtension(file, language) {
  return language === "js"
    ? file.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js")
    : file;
}

export function transformSource(
  source,
  sourcePath,
  targetPath,
  mapping,
  language,
) {
  if (sourcePath.endsWith(".css")) return source;
  const sf = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    sourcePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const replacements = [];
  for (const statement of sf.statements) {
    if (
      !(ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
    )
      continue;
    const specifier = statement.moduleSpecifier;
    if (
      !specifier ||
      !ts.isStringLiteral(specifier) ||
      !specifier.text.startsWith(".")
    )
      continue;
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(sourcePath), specifier.text),
    );
    const found = [
      resolved,
      `${resolved}.tsx`,
      `${resolved}.ts`,
      `${resolved}/index.tsx`,
      `${resolved}/index.ts`,
    ].find((candidate) => mapping.has(candidate));
    if (!found)
      throw new Error(
        `无法解析组件的内部引用：${sourcePath} -> ${specifier.text}`,
      );
    const modulePath = relativeImport(targetPath, mapping.get(found)).replace(
      /\.(tsx?|jsx?)$/,
      "",
    );
    replacements.push({
      start: specifier.getStart(sf),
      end: specifier.end,
      value: JSON.stringify(modulePath),
    });
  }
  for (const item of replacements.reverse())
    source = source.slice(0, item.start) + item.value + source.slice(item.end);
  if (language === "js") {
    const result = ts.transpileModule(source, {
      fileName: sourcePath,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.Preserve,
        verbatimModuleSyntax: false,
        removeComments: false,
      },
      reportDiagnostics: true,
    });
    const errors =
      result.diagnostics?.filter(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
      ) ?? [];
    if (errors.length)
      throw new Error(
        ts.flattenDiagnosticMessageText(errors[0].messageText, "\n"),
      );
    return result.outputText;
  }
  return source;
}

export async function registryWrites(config, root, registry) {
  const files = registry.files.filter(
    (file) => config.examples || !file.path.startsWith("examples/"),
  );
  const mapping = new Map(
    files.map(({ path: source }) => [
      source,
      path.join(
        root,
        outputExtension(destinationFor(source, config), config.language),
      ),
    ]),
  );
  if (new Set(mapping.values()).size !== mapping.size)
    throw new Error("组件、工具和样式的输出路径存在冲突。");
  const writes = new Map();
  for (const file of files) {
    if (
      !/^(components\/ui|lib|styles|examples\/design-system)\/[\w.-]+$/.test(
        file.path,
      )
    )
      throw new Error(`不安全的注册表路径：${file.path}`);
    const source = await readFile(path.join(registryRoot, file.path), "utf8");
    if (digest(source) !== file.sha256)
      throw new Error(`注册表文件校验失败：${file.path}`);
    const target = mapping.get(file.path);
    let content = transformSource(
      source,
      file.path,
      target,
      mapping,
      config.language,
    );
    if (file.path === "styles/index.css") {
      const components = posix(
        path.relative(path.dirname(target), path.join(root, config.components)),
      );
      content = content.replace(
        '@source "../components/ui";',
        `@source ${JSON.stringify(components.startsWith(".") ? components : `./${components}`)};`,
      );
      if (config.examples)
        content += `\n@source ${JSON.stringify(relativeImport(target, path.join(root, config.examplesPath)))};\n`;
    }
    writes.set(posix(path.relative(root, target)), content);
  }
  return writes;
}
