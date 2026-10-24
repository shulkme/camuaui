import { lstat, realpath, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export const posix = (value) => value.split(path.sep).join("/");
export const relativeImport = (fromFile, toFile) => {
  const relative = posix(path.relative(path.dirname(fromFile), toFile));
  return relative.startsWith(".") ? relative : `./${relative}`;
};

export async function exists(file) {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function readOptional(file) {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function projectPath(root, relative, { internal = false } = {}) {
  if (
    typeof relative !== "string" ||
    !relative.trim() ||
    path.isAbsolute(relative) ||
    relative.includes("\\") ||
    /[\x00-\x1f"';]/.test(relative)
  ) {
    throw new Error(`项目路径必须为安全的相对路径：${relative}`);
  }
  const target = path.resolve(root, relative);
  const within = path.relative(root, target);
  if (
    !within ||
    within.startsWith(`..${path.sep}`) ||
    within === ".." ||
    path.isAbsolute(within)
  )
    throw new Error(`路径不能离开项目：${relative}`);
  if (
    within
      .split(path.sep)
      .some((segment) =>
        ["node_modules", ".git", ...(internal ? [] : [".camuaui"])].includes(
          segment,
        ),
      )
  )
    throw new Error(`不能把组件输出到 ${relative}`);
  // Reject symlinks at any existing ancestor, including the final file itself.
  // Lexical containment alone does not protect writes through linked directories.
  let cursor = root;
  for (const segment of within.split(path.sep)) {
    cursor = path.join(cursor, segment);
    try {
      if ((await lstat(cursor)).isSymbolicLink())
        throw new Error(`输出路径不能经过符号链接：${relative}`);
    } catch (error) {
      if (error.code === "ENOENT") break;
      throw error;
    }
  }
  return target;
}

export async function projectRoot(cwd) {
  const root = await realpath(path.resolve(cwd));
  if (!(await exists(path.join(root, "package.json"))))
    throw new Error(
      "请在含 package.json 的 React 项目根目录执行，或使用 --cwd 指定项目。",
    );
  return root;
}

export async function writeParent(file) {
  await mkdir(path.dirname(file), { recursive: true });
}
