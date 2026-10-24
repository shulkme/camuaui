import { copyFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
await copyFile(new URL("LICENSE", root), new URL("packages/create-camuaui/LICENSE", root));
console.log("create-camuaui: stable launcher for camuaui@latest (independent version)");
