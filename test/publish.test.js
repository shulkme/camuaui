import test from "node:test";
import assert from "node:assert/strict";
import { releasePlan, verifyPublished } from "../scripts/publish.mjs";
import { createHash } from "node:crypto";

const packages = [{ name: "camuaui", version: "0.2.4" }];
const metadata = (latest, versions = [latest]) => ({ "dist-tags": { latest }, versions: Object.fromEntries(versions.map(version => [version, {}])) });

test("release planning skips initial bootstrap and unchanged versions", () => {
  const first = releasePlan(packages, [null]);
  assert.equal(first.bootstrap, true);
  assert(first.packages.every(pkg => !pkg.publish));
  assert(releasePlan(packages, [metadata("0.2.4")]).packages.every(pkg => !pkg.publish));
});

test("release planning publishes only the core when its version is new", () => {
  const full = releasePlan(packages, [metadata("0.2.3")]);
  assert.deepEqual(full.packages.filter(pkg => pkg.publish).map(pkg => pkg.name), ["camuaui"]);
});

test("release planning does not downgrade latest or depend on the launcher version", () => {
  assert(releasePlan(packages, [metadata("0.3.0")]).packages.every(pkg => !pkg.publish));
  assert.equal(releasePlan(packages, [metadata("0.2.3")]).bootstrap, false);
});

const archive = Buffer.from("published archive");
const dist = {
  shasum: createHash("sha1").update(archive).digest("hex"),
  integrity: `sha512-${createHash("sha512").update(archive).digest("base64")}`,
  tarball: "https://registry.npmjs.org/camuaui/-/camuaui-0.2.4.tgz",
};
const published = { ...packages[0], dist };
const options = { delays: [0, 0, 0, 0], wait: async () => {}, onPending: () => {} };

test("publication verification tolerates processing delays, network errors and transient registry responses", async () => {
  const urls = [];
  const responses = [new Response(null, { status: 404 }), new Error("network timeout"), new Response(null, { status: 503 }), Response.json(published), new Response(null, { status: 404 }), Response.json(published), new Response(archive)];
  const result = await verifyPublished(packages[0], dist, {
    ...options,
    fetchImpl: async (url, init) => {
      urls.push(url);
      assert.equal(init.headers["cache-control"], "no-cache");
      const value = responses.shift();
      if (value instanceof Error) throw value;
      return value;
    },
  });
  assert.equal(result.version, "0.2.4");
  assert.equal(responses.length, 0);
  const manifests = urls.filter(url => url !== dist.tarball);
  assert(manifests.every(url => url.startsWith("https://registry.npmjs.org/camuaui/0.2.4?verification=")));
  assert.equal(new Set(manifests).size, manifests.length);
});

test("verification checks existing releases without requiring another publish", async () => {
  const responses = [Response.json(published), new Response(archive)];
  const result = await verifyPublished(packages[0], undefined, { ...options, fetchImpl: async () => responses.shift() });
  assert.equal(result.dist.shasum, dist.shasum);
});

test("verification rejects checksum mismatches immediately and never masks permission errors", async () => {
  for (const scenario of [
    { responses: [Response.json(published)], expected: { shasum: "different" }, message: /Published checksum mismatch/ },
    { responses: [Response.json(published), new Response("corrupt")], expected: dist, message: /Downloaded checksum mismatch/ },
    { responses: [new Response(null, { status: 403 })], expected: dist, message: /registry returned 403/ },
  ]) {
    await assert.rejects(verifyPublished(packages[0], scenario.expected, { ...options, wait: async () => assert.fail("Must not retry"), fetchImpl: async () => scenario.responses.shift() }), scenario.message);
  }
});

test("verification exhaustion explains pending processing and safe Actions retries", async () => {
  let calls = 0;
  await assert.rejects(verifyPublished(packages[0], dist, {
    ...options, delays: [0, 0], fetchImpl: async () => { calls++; return new Response(null, { status: 404 }); },
  }), /still pending.*rerun Actions.*without publishing again/);
  assert.equal(calls, 3);
});
