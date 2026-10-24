import pc from "picocolors";

export function supportsColor(stream = process.stdout, env = process.env) {
  if (env.NO_COLOR !== undefined || env.FORCE_COLOR === "0") return false;
  if (env.FORCE_COLOR !== undefined) return true;
  return Boolean(stream.isTTY && env.TERM !== "dumb");
}

export function createReporter({
  log = console.log,
  stream = process.stdout,
  color = supportsColor(stream),
} = {}) {
  const c = pc.createColors(color);
  const status = (symbol, paint) => (message) =>
    log(`  ${paint(`${symbol} ${message}`)}`);

  return {
    intro(version) {
      log(`\n  ${c.bold(c.cyan("Camua UI"))} ${c.dim(`v${version}`)}`);
      log(c.dim("  React 组件 · 主题 · 可选示例\n"));
    },
    section(title) {
      log(`\n  ${c.bold(title)}`);
    },
    detail(label, value) {
      log(`    ${c.dim(`${label}：`)}${value}`);
    },
    note(message) {
      log(`    ${c.dim(message)}`);
    },
    command(command) {
      log(`    ${c.cyan(command)}`);
    },
    question(message) {
      return `  ${c.cyan(`? ${c.bold(message)}`)} `;
    },
    help(message) {
      log(message
        .replace(/^Camua UI/, c.bold(c.cyan("Camua UI")))
        .replace(/^(用法|选项)：/gm, (heading) => c.bold(heading))
        .replace(/^(  (?:npx|npm) .+)$/gm, (command) => c.cyan(command)));
    },
    info: status("i", c.cyan),
    step: status("›", c.cyan),
    success: status("✔", c.green),
    warn: status("!", c.yellow),
    error: status("✖", c.red),
  };
}
