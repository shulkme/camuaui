import test from "node:test";
import assert from "node:assert/strict";
import { releasePlan } from "../scripts/publish.mjs";

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
