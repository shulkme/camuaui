import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = "https://registry.npmjs.org/";

export function releasePlan(packages, metadata) {
  const bootstrap = metadata.some(item => item === null);
  return {
    bootstrap,
    packages: packages.map((pkg, index) => {
      if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error("Automatic publishing currently requires a stable x.y.z version.");
      const latest = metadata[index]?.["dist-tags"]?.latest;
      const parts = value => value.split(".").map(Number);
      const compare = (a, b) => {
        for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
        return 0;
      };
      const newerExists = latest && /^\d+\.\d+\.\d+$/.test(latest) && compare(parts(pkg.version), parts(latest)) < 0;
      return { ...pkg, publish: !bootstrap && !newerExists && !metadata[index]?.versions?.[pkg.version] };
    }),
  };
}

async function metadata(name) {
  const response = await fetch(`${registry}${name}`, { headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(20000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Registry returned ${response.status} for ${name}`);
  return response.json();
}

function npm(args, cwd = root, capture = false) {
  if (!process.env.npm_execpath) throw new Error("Use npm run publish:ci so the npm CLI path is available.");
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd, encoding: "utf8", stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit", windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`npm ${args[0]} failed (${result.status})`);
  return result.stdout;
}

async function publish() {
  const packages = await Promise.all(["."].map(async directory => ({
    ...JSON.parse(await readFile(path.join(root, directory, "package.json"), "utf8")), directory,
  })));
  const plan = releasePlan(packages, await Promise.all(packages.map(pkg => metadata(pkg.name))));
  if (plan.bootstrap) {
    console.log("::notice::First core publish required: publish camuaui once, then configure npm Trusted Publishing for shulkme/camuaui, workflow publish.yml, with Allow npm publish enabled. Future core versions publish automatically.");
    return;
  }
  if (process.env.GITHUB_ACTIONS !== "true") throw new Error("Publishing runs in GitHub Actions after source is pushed. Use npm run release -- patch.");
  const output = path.join(root, "artifacts");
  await mkdir(output, { recursive: true });
  for (const pkg of plan.packages) {
    if (!pkg.publish) { console.log(`Skip ${pkg.name}@${pkg.version}: already published or superseded.`); continue; }
    const raw = npm(["pack", "--json", "--pack-destination", output], path.join(root, pkg.directory), true);
    const start = raw.search(/\[\s*\{\s*"id"/);
    if (start < 0) throw new Error("Missing package metadata");
    console.log(raw.slice(0, start));
    const [artifact] = JSON.parse(raw.slice(start));
    if (artifact.name !== pkg.name || artifact.version !== pkg.version) throw new Error("Packed version mismatch");
    if (artifact.files.some(file => /^(src|test|scripts|\.github)\//.test(file.path))) throw new Error("Development source leaked into npm package");
    npm(["publish", path.join(output, artifact.filename), "--access", "public", "--provenance", "--registry", registry]);
    let verified = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      const current = await metadata(pkg.name);
      const published = current?.versions?.[pkg.version];
      if (published) {
        if (published.dist.shasum !== artifact.shasum) throw new Error("Published checksum mismatch");
        verified = true;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (!verified) throw new Error(`Unable to verify ${pkg.name}@${pkg.version}; remaining packages were not published.`);
    console.log(`Verified ${pkg.name}@${pkg.version}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  publish().catch(error => { console.error(error.message); process.exitCode = 1; });
}
