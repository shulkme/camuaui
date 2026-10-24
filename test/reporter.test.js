import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { createReporter, supportsColor } from "../src/reporter.js";
import { main } from "../src/cli.js";

test("terminal colors respect TTY, NO_COLOR, FORCE_COLOR and dumb terminals", () => {
  assert.equal(supportsColor({ isTTY: true }, {}), true);
  assert.equal(supportsColor({ isTTY: false }, {}), false);
  assert.equal(supportsColor({ isTTY: true }, { TERM: "dumb" }), false);
  assert.equal(supportsColor({ isTTY: false }, { FORCE_COLOR: "1" }), true);
  assert.equal(supportsColor({ isTTY: true }, { FORCE_COLOR: "0" }), false);
  assert.equal(supportsColor({ isTTY: true }, { NO_COLOR: "" }), false);
  assert.equal(supportsColor({ isTTY: true }, { NO_COLOR: "1", FORCE_COLOR: "1" }), false);
});

test("styled and plain reporters preserve identical readable messages", () => {
  const render = (color) => {
    const lines = [];
    const reporter = createReporter({ color, log: (line) => lines.push(line) });
    reporter.intro("0.1.1");
    reporter.section("同步计划");
    reporter.detail("组件", "src/components/ui");
    reporter.note("安装输出");
    reporter.command("pnpm add @base-ui/react@latest");
    for (const kind of ["info", "step", "success", "warn", "error"])
      reporter[kind](kind);
    lines.push(reporter.question("是否添加示例？[y/N]："));
    return lines.join("\n");
  };
  const plain = render(false);
  const styled = render(true);
  assert.equal(stripVTControlCharacters(plain), plain);
  assert.notEqual(styled, plain);
  assert.equal(stripVTControlCharacters(styled), plain);
  for (const code of [31, 32, 33, 36])
    assert.ok(styled.includes(`\x1b[${code}m`));
});

test("version and list remain machine-readable even with color enabled", async () => {
  for (const args of [["--version"], ["list"]]) {
    const lines = [];
    await main(args, { color: true, log: (line) => lines.push(line) });
    const output = lines.join("\n");
    assert.equal(stripVTControlCharacters(output), output);
    if (args[0] === "list") {
      assert.match(output, /^[a-z-]+(?:\n[a-z-]+)*$/);
      assert.ok(output.split("\n").includes("button"));
      assert.ok(output.split("\n").includes("avatar"));
    } else assert.match(output, /^\d+\.\d+\.\d+$/);
  }
});

test("CLI errors use stderr, preserve nonzero status and honor NO_COLOR", () => {
  const cli = fileURLToPath(new URL("../bin/camuaui.js", import.meta.url));
  for (const color of [true, false]) {
    const env = { ...process.env, FORCE_COLOR: "1" };
    delete env.NO_COLOR;
    if (!color) env.NO_COLOR = "1";
    const result = spawnSync(process.execPath, [cli, "--invalid-option"], {
      encoding: "utf8", env,
    });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(stripVTControlCharacters(result.stderr), /Camua UI:/);
    assert.equal(result.stderr.includes("\x1b[31m"), color);
  }
});
