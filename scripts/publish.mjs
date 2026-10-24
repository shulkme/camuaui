import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

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
  const response = await fetch(`${registry}${encodeURIComponent(name)}?verification=${Date.now()}`, { headers: { "cache-control": "no-cache" }, signal: AbortSignal.timeout(20000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Registry returned ${response.status} for ${name}`);
  return response.json();
}

export async function verifyPublished(pkg, expected, {
  fetchImpl = fetch,
  wait = ms => new Promise(resolve => setTimeout(resolve, ms)),
  delays = Array.from({ length: 34 }, (_, i) => Math.min(1000 * 2 ** i, 10000)),
  onPending = message => console.log(message),
} = {}) {
  const label = `${pkg.name}@${pkg.version}`;
  const deadline = Date.now() + 300000;
  let pending = "version is not available yet";
  async function request(url) {
    let response;
    try {
      response = await fetchImpl(url, {
        headers: { "cache-control": "no-cache", pragma: "no-cache" },
        signal: AbortSignal.timeout(Math.max(1, Math.min(20000, deadline - Date.now()))),
      });
    } catch (error) {
      pending = error.message;
      return null;
    }
    if (response.status === 404 || response.status === 429 || response.status >= 500) {
      pending = `registry returned ${response.status}`;
      return null;
    }
    if (!response.ok) throw new Error(`Unable to verify ${label}: registry returned ${response.status}`);
    return response;
  }
  for (let attempt = 0; attempt <= delays.length && Date.now() < deadline; attempt++) {
    // Query the exact version with a fresh URL instead of repeatedly reading a cached packument.
    const response = await request(`${registry}${encodeURIComponent(pkg.name)}/${encodeURIComponent(pkg.version)}?verification=${Date.now()}-${attempt}`);
    if (response) {
      const published = await response.json();
      if (published.name !== pkg.name || published.version !== pkg.version)
        throw new Error(`Published identity mismatch for ${label}`);
      const dist = published.dist;
      if (dist?.shasum && dist.tarball) {
        if (expected && dist.shasum !== expected.shasum) throw new Error(`Published checksum mismatch for ${label}`);
        if (expected?.integrity && dist.integrity !== expected.integrity) throw new Error(`Published integrity mismatch for ${label}`);
        const archive = await request(dist.tarball);
        if (archive) {
          const bytes = Buffer.from(await archive.arrayBuffer());
          if (createHash("sha1").update(bytes).digest("hex") !== dist.shasum)
            throw new Error(`Downloaded checksum mismatch for ${label}`);
          if (dist.integrity?.startsWith("sha512-") && `sha512-${createHash("sha512").update(bytes).digest("base64")}` !== dist.integrity)
            throw new Error(`Downloaded integrity mismatch for ${label}`);
          return published;
        }
      } else pending = "package metadata is still being processed";
    }
    if (attempt === delays.length || Date.now() >= deadline) break;
    onPending(`Waiting for npm to make ${label} available (${pending}; retry ${attempt + 1})...`);
    await wait(Math.min(delays[attempt], Math.max(0, deadline - Date.now())));
  }
  throw new Error(`npm publication verification is still pending for ${label}: ${pending}. Check the package on npm and rerun Actions; existing versions will be verified without publishing again.`);
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
    if (!pkg.publish) {
      console.log(`Skip publishing ${pkg.name}@${pkg.version}: already published or superseded.`);
      await verifyPublished(pkg);
      console.log(`Verified existing ${pkg.name}@${pkg.version}`);
      continue;
    }
    const raw = npm(["pack", "--json", "--pack-destination", output], path.join(root, pkg.directory), true);
    const start = raw.search(/\[\s*\{\s*"id"/);
    if (start < 0) throw new Error("Missing package metadata");
    console.log(raw.slice(0, start));
    const [artifact] = JSON.parse(raw.slice(start));
    if (artifact.name !== pkg.name || artifact.version !== pkg.version) throw new Error("Packed version mismatch");
    if (artifact.files.some(file => /^(src|test|scripts|\.github)\//.test(file.path))) throw new Error("Development source leaked into npm package");
    npm(["publish", path.join(output, artifact.filename), "--access", "public", "--provenance", "--registry", registry]);
    await verifyPublished(pkg, artifact);
    console.log(`Verified ${pkg.name}@${pkg.version}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  publish().catch(error => { console.error(error.message); process.exitCode = 1; });
}
