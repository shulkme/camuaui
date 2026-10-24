#!/usr/bin/env node
import spawn from "cross-spawn";

// Keep this entry stable. npm resolves the current core on every invocation.
const result = spawn.sync("npm", [
  "exec", "--yes", "--prefer-online", "--package=camuaui@latest", "--", "create-camuaui",
  ...process.argv.slice(2),
], { stdio: "inherit", windowsHide: true });
if (result.error) console.error(`Camua UI: ${result.error.message}`);
process.exitCode = result.status ?? 1;
