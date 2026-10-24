import test from "node:test";
import assert from "node:assert/strict";
import { releasePlan } from "../scripts/publish.mjs";

const packages = [{ name: "camuaui", version: "0.2.4" }, { name: "create-camuaui", version: "0.2.4" }];
const metadata = (latest, versions = [latest]) => ({ "dist-tags": { latest }, versions: Object.fromEntries(versions.map(version => [version, {}])) });

test("release planning skips initial bootstrap and unchanged versions", () => {
  const first = releasePlan(packages, [null, null]);
  assert.equal(first.bootstrap, true);
  assert(first.packages.every(pkg => !pkg.publish));
  assert(releasePlan(packages, [metadata("0.2.4"), metadata("0.2.4")]).packages.every(pkg => !pkg.publish));
});

test("release planning publishes missing versions in dependency order and recovers a partial release", () => {
  const full = releasePlan(packages, [metadata("0.2.3"), metadata("0.2.3")]);
  assert.deepEqual(full.packages.filter(pkg => pkg.publish).map(pkg => pkg.name), ["camuaui", "create-camuaui"]);
  const partial = releasePlan(packages, [metadata("0.2.4"), metadata("0.2.3")]);
  assert.deepEqual(partial.packages.map(pkg => pkg.publish), [false, true]);
});

test("release planning does not downgrade latest or publish when a companion package needs bootstrap", () => {
  assert(releasePlan(packages, [metadata("0.3.0"), metadata("0.3.0")]).packages.every(pkg => !pkg.publish));
  assert(releasePlan(packages, [metadata("0.2.3"), null]).packages.every(pkg => !pkg.publish));
});
