import spawn from "cross-spawn";

export function installCommands(manager, plan) {
  const commands = [];
  for (const [names, development] of [
    [plan.runtime, false],
    [plan.development, true],
  ]) {
    if (!names.length) continue;
    const args =
      manager === "npm"
        ? ["install", ...(development ? ["--save-dev"] : ["--save"])]
        : ["add", ...(development ? [manager === "bun" ? "--dev" : "-D"] : [])];
    commands.push({
      command: manager,
      args: [...args, ...names.map((name) => `${name}@latest`)],
    });
  }
  if (!commands.length && plan.needsRestore)
    commands.push({ command: manager, args: ["install"] });
  return commands;
}

export async function runInstall(root, commands) {
  for (const { command, args } of commands) {
    await new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: root,
        stdio: "inherit",
        env: {
          ...process.env,
          npm_config_fund: "false",
          npm_config_audit: "false",
        },
      });
      child.on("error", (error) =>
        reject(
          new Error(
            `无法运行 ${command}：${error.message}。可使用 --package-manager npm。`,
          ),
        ),
      );
      child.on("exit", (code, signal) =>
        code === 0
          ? resolve()
          : reject(
              new Error(
                `${command} ${args.join(" ")} 失败（${signal ?? code}）。组件源码尚未写入；修复依赖后重新执行。`,
              ),
            ),
      );
    });
  }
}
