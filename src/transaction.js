import { readFile, writeFile, rename, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { exists, projectPath, writeParent } from "./paths.js";

export async function commitFiles(
  root,
  writes,
  removals = [],
  { backup = true, write = writeFile } = {},
) {
  const originals = new Map();
  const targets = new Map();
  for (const relative of new Set([...writes.keys(), ...removals])) {
    const file = await projectPath(root, relative, {
      internal: relative === ".camuaui/manifest.json",
    });
    targets.set(relative, file);
    originals.set(relative, (await exists(file)) ? await readFile(file) : null);
  }
  const changed = [...writes].filter(
    ([relative, content]) => originals.get(relative)?.toString() !== content,
  );
  const removed = removals.filter(
    (relative) => originals.get(relative) !== null,
  );
  let backupPath = null;
  if (
    backup &&
    [...changed.map(([relative]) => relative), ...removed].some(
      (relative) => originals.get(relative) !== null,
    )
  ) {
    await projectPath(root, ".camuaui/manifest.json", { internal: true });
    backupPath = path.join(
      root,
      ".camuaui",
      "backups",
      `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`,
    );
    for (const relative of new Set([
      ...changed.map(([relative]) => relative),
      ...removed,
    ])) {
      const before = originals.get(relative);
      if (before === null) continue;
      const file = await projectPath(
        root,
        path
          .relative(root, path.join(backupPath, relative))
          .split(path.sep)
          .join("/"),
        { internal: true },
      );
      await writeParent(file);
      await writeFile(file, before);
    }
  }
  const committed = [];
  let temporary;
  try {
    for (const [relative, content] of changed) {
      const file = targets.get(relative);
      await writeParent(file);
      temporary = `${file}.camuaui-${randomUUID()}.tmp`;
      await write(temporary, content, "utf8");
      await rename(temporary, file);
      temporary = null;
      committed.push(relative);
    }
    for (const relative of removed) {
      await unlink(targets.get(relative));
      committed.push(relative);
    }
  } catch (error) {
    if (temporary) await unlink(temporary).catch(() => {});
    for (const relative of committed.reverse()) {
      const before = originals.get(relative);
      if (before === null) await unlink(targets.get(relative)).catch(() => {});
      else await writeFile(targets.get(relative), before);
    }
    throw new Error(`写入失败，已恢复本次写入的源码文件：${error.message}`);
  }
  return {
    changed: changed.map(([relative]) => relative),
    removed,
    backupPath,
  };
}
