// Run with node test/page-stack.browser.cjs while the local preview serves port 3001.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.CAMUAUI_PLAYWRIGHT_MODULE || "playwright");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("http://127.0.0.1:3001/design-system");
    const demo = page.locator('[data-demo="page-stack"]');
    const stack = demo.locator('[data-page-stack]');
    const panel = value => stack.locator(`[data-page-stack-page="${value}"]`);
    const settled = () => stack.evaluate(async root => {
      await new Promise(requestAnimationFrame);
      await Promise.all(root.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
    });
    await demo.scrollIntoViewIfNeeded();
    assert.equal(await stack.locator('[inert]').count(), 2);
    await panel("settings").getByRole("button").focus();
    await panel("settings").getByRole("button").dispatchEvent("click");
    assert.equal(await panel("profile").evaluate(el => document.activeElement === el), true);
    await page.waitForTimeout(45);
    const forward = await stack.evaluate(root => {
      const x = root.getBoundingClientRect().x;
      return [...root.children].map(el => el.getBoundingClientRect().x - x);
    });
    assert(forward[0] < 0 && forward[1] > 0, "forward: parent exits left, child enters from right");
    await settled();
    const input = panel("profile").getByRole("textbox");
    await input.fill("保留输入");
    await panel("profile").getByRole("button", { name: "通知偏好 →" }).click();
    await settled();
    const before = await stack.evaluate(el => el.getBoundingClientRect().height);
    await panel("notifications").getByRole("button", { name: "展开说明" }).click();
    await page.waitForTimeout(380);
    assert(await stack.evaluate(el => el.getBoundingClientRect().height) > before, "dynamic height grows");
    await panel("notifications").getByRole("button", { name: "← 返回个人资料" }).dispatchEvent("click");
    await page.waitForTimeout(45);
    const back = await stack.evaluate(root => {
      const x = root.getBoundingClientRect().x;
      return [...root.children].map(el => el.getBoundingClientRect().x - x);
    });
    assert(back[1] < 0 && back[2] > 0, "back: parent enters from left, child exits right");
    await settled();
    assert.equal(await input.inputValue(), "保留输入");
    // Reverse twice before the first transition finishes.
    await panel("profile").getByRole("button", { name: "通知偏好 →" }).dispatchEvent("click");
    await page.waitForTimeout(35);
    await panel("notifications").getByRole("button", { name: "← 返回个人资料" }).dispatchEvent("click");
    await page.waitForTimeout(35);
    await panel("profile").getByRole("button", { name: "← 返回设置" }).dispatchEvent("click");
    await settled();
    assert.equal(await stack.locator('[data-active]').getAttribute('data-page-stack-page'), "settings");
    assert.equal(await panel("profile").evaluate(el => getComputedStyle(el).visibility), "hidden");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await panel("settings").getByRole("button").dispatchEvent("click");
    assert.equal(await stack.evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      await page.setViewportSize({ width: 390, height: 844 });
      await demo.scrollIntoViewIfNeeded();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    }
    assert.deepEqual(errors, []);
    console.log("PageStack: forward/back, rapid reversals, focus, retained input, dynamic height, reduced motion and mobile themes passed.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
