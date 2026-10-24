// Real consumer smoke checks. Uses isolated temporary projects, never the workspace app.
import { mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import spawn from "cross-spawn";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const version = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
).version;
const tarball = path.join(packageRoot, `camuaui-${version}.tgz`);
const root = await mkdtemp(path.join(os.tmpdir(), "camuaui-integration-"));
console.log(`Integration projects: ${root}`);
await writeFile(path.join(packageRoot, ".integration-path"), root);

async function write(directory, file, content) {
  await mkdir(path.dirname(path.join(directory, file)), { recursive: true });
  await writeFile(
    path.join(directory, file),
    typeof content === "object" ? JSON.stringify(content, null, 2) : content,
  );
}
async function run(directory, command, args) {
  const chunks = [];
  const child = spawn(command, args, {
    cwd: directory,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    windowsHide: true,
  });
  for (const stream of [child.stdout, child.stderr])
    stream.on("data", (chunk) => chunks.push(chunk));
  const code = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });
  const output = Buffer.concat(chunks).toString();
  await writeFile(
    path.join(directory, `${command}-${args[0]}.log`.replaceAll(":", "-")),
    output,
  );
  if (code !== 0)
    throw new Error(
      `${path.basename(directory)}: ${command} ${args.join(" ")}\n${output.slice(-14000)}`,
    );
  console.log(
    `${path.basename(directory)}: ${command} ${args.join(" ")} passed`,
  );
}

async function consumer(name) {
  const directory = path.join(root, name);
  await mkdir(directory);
  const vite = name === "vite";
  const next = name === "next";
  await write(directory, "package.json", {
    name: `camuaui-${name}-integration`,
    private: true,
    type: "module",
    scripts: {
      build: vite
        ? "tsc --noEmit && vite build"
        : next
          ? "next build"
          : "tsc --noEmit && remix vite:build",
    },
    dependencies: {
      react: next || vite ? "19.3.1" : "18.3.1",
      "react-dom": next || vite ? "19.3.1" : "18.3.1",
      ...(next
        ? { next: "16.4.2" }
        : !vite
          ? {
              "@remix-run/react": "2.17.5",
              "@remix-run/node": "2.17.5",
              "@remix-run/serve": "2.17.5",
              isbot: "^4",
            }
          : {}),
    },
    devDependencies: {
      ...(!next
        ? {
            vite: vite ? "8.3.4" : "^6.0.0",
            ...(vite
              ? { "@vitejs/plugin-react": "latest" }
              : { "@remix-run/dev": "2.17.5" }),
            typescript: "5.9.3",
            "@types/react": vite ? "19.3.0" : "^18",
            "@types/react-dom": vite ? "19.3.0" : "^18",
            "@types/node": "latest",
          }
        : {}),
    },
  });
  if (!next)
    await write(directory, "tsconfig.json", {
      compilerOptions: {
        target: "ES2022",
        lib: ["DOM", "DOM.Iterable", "ES2022"],
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "Bundler",
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        noEmit: true,
      },
      include: vite ? ["src"] : ["app"],
    });
  if (vite) {
    await write(
      directory,
      "index.html",
      '<html><head><title>Camua UI test</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    );
    await write(
      directory,
      "vite.config.ts",
      'import { defineConfig } from "vite"; import react from "@vitejs/plugin-react"; export default defineConfig({ plugins: [react()] });',
    );
    await write(
      directory,
      "src/main.tsx",
      'import { StrictMode } from "react"; import { createRoot } from "react-dom/client"; import "./index.css"; import { UIProvider } from "./components/ui/provider"; import { DesignSystem } from "./components/camuaui-examples"; createRoot(document.getElementById("root")!).render(<StrictMode><UIProvider><DesignSystem /></UIProvider></StrictMode>);',
    );
    await write(
      directory,
      "src/index.css",
      "/* custom host styles survive setup */\n.host { color: red; }\n",
    );
  } else if (next) {
    await write(
      directory,
      "app/layout.jsx",
      'import "./globals.css"; import { UIProvider } from "./components/ui/provider"; export default function Layout({children}) { return <html lang="zh-CN"><body><UIProvider>{children}</UIProvider></body></html>; }',
    );
    await write(
      directory,
      "app/page.jsx",
      'import { DesignSystem } from "./components/camuaui-examples"; export default function Page() { return <DesignSystem />; }',
    );
    await write(directory, "app/globals.css", "/* custom host styles */\n");
  } else {
    await write(
      directory,
      "vite.config.ts",
      'import { vitePlugin as remix } from "@remix-run/dev"; import { defineConfig } from "vite"; export default defineConfig({ plugins: [remix()] });',
    );
    await write(
      directory,
      "app/root.tsx",
      'import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"; import "./styles.css"; import { UIProvider } from "./components/ui/provider"; export default function App() { return <html lang="zh-CN"><head><Meta/><Links/></head><body><UIProvider><Outlet/></UIProvider><ScrollRestoration/><Scripts/></body></html>; }',
    );
    await write(
      directory,
      "app/routes/_index.tsx",
      'import { DesignSystem } from "../components/camuaui-examples"; export default function Index() { return <DesignSystem />; }',
    );
    await write(directory, "app/styles.css", "/* custom host styles */\n");
  }
  await run(directory, "npm", ["install", "--no-audit", "--no-fund"]);
  await run(directory, "npm", [
    "exec",
    "--yes",
    "--package",
    tarball,
    "--",
    "camuaui",
    "--yes",
    "--examples",
  ]);
  const config = JSON.parse(
    await readFile(path.join(directory, "camuaui.json")),
  );
  if (!config.examples || config.language !== (next ? "js" : "ts"))
    throw new Error("Incorrect consumer configuration");
  await run(directory, "npm", ["run", "build"]);
  return directory;
}
const results = await Promise.allSettled(
  ["vite", "next", "remix"].map(consumer),
);
let failures = 0;
for (const result of results)
  if (result.status === "rejected") {
    failures++;
    console.error(result.reason);
  }
if (failures) process.exitCode = 1;
else console.log("All three packed CLI consumer builds passed.");
