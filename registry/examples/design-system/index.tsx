import { ButtonExamples, ThemeControls } from "./examples";
import { ComponentExamples } from "./component-examples";

const colors = [
  {
    name: "主操作 / 随主题适配",
    token: "primary",
    className: "bg-primary text-primary-foreground",
  },
  {
    name: "强调蓝",
    token: "accent-100",
    className: "bg-accent-100 text-accent-900",
  },
  {
    name: "页面背景",
    token: "background",
    className: "bg-background text-primary",
  },
  {
    name: "轻量悬停背景",
    token: "background-hover",
    className: "bg-background-hover text-primary",
  },
  {
    name: "分隔线",
    token: "divider",
    className: "bg-divider text-primary",
  },
  {
    name: "控件边框",
    token: "control-border",
    className: "bg-control-border text-primary",
  },
  {
    name: "内容表面",
    token: "surface",
    className: "bg-surface text-primary",
  },
  {
    name: "浮层表面",
    token: "surface-raised",
    className: "bg-surface-raised text-primary",
  },
  {
    name: "次要组件背景",
    token: "surface-muted",
    className: "bg-surface-muted text-primary",
  },
];

const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const palettes = [
  { name: "中性灰", token: "gray" },
  { name: "强调蓝", token: "accent" },
  { name: "错误", token: "error" },
  { name: "警告", token: "warning" },
  { name: "成功", token: "success" },
  { name: "信息", token: "info" },
];

const textColors = [
  {
    level: "primary",
    label: "主要 · 默认文字与标题",
    className: "text-primary",
  },
  { level: "secondary", label: "次要 · 副标题", className: "text-secondary" },
  {
    level: "tertiary",
    label: "描述 · 辅助说明与占位",
    className: "text-tertiary",
  },
  {
    level: "quaternary",
    label: "禁用 · 不可用内容",
    className: "text-quaternary",
  },
];

export function DesignSystem() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-5 py-8 sm:px-8 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-divider pt-12 pb-6 sm:pt-0">
        <h1 className="text-title font-semibold">组件示例</h1>
        <div
          data-demo="floating-theme-controls"
          className="pointer-events-none fixed inset-x-5 top-4 z-40 mx-auto flex max-w-272 justify-end sm:inset-x-8 sm:top-6"
        >
          <div className="pointer-events-auto rounded-full bg-surface-raised shadow-popup">
            <ThemeControls />
          </div>
        </div>
      </header>

      <section aria-labelledby="colors-title" className="space-y-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-label text-tertiary">01</span>
          <h2 id="colors-title" className="text-title font-semibold">
            语义色彩
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((color) => (
            <div
              key={color.token}
              data-semantic-token={color.token}
              className={`flex min-h-36 flex-col justify-end gap-1 rounded-lg p-5 ${color.className}`}
            >
              <span className="font-medium">{color.name}</span>
              <code className="font-mono text-label">--{color.token}</code>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            ["成功 / 已连接", "bg-success-100 text-success-900"],
            ["提醒 / 待处理", "bg-warning-100 text-warning-900"],
            ["信息 / 同步中", "bg-info-100 text-info-900"],
            ["风险 / 连接异常", "bg-error-100 text-error-900"],
          ].map(([label, className]) => (
            <span
              key={label}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label font-medium ${className}`}
            >
              <span
                className="size-1.5 rounded-full bg-current"
                aria-hidden="true"
              />
              {label}
            </span>
          ))}
        </div>
        <div className="space-y-8 rounded-2xl bg-surface p-5 sm:p-8">
          <div className="space-y-2">
            <h3 className="font-semibold">基础色阶</h3>
            <p className="text-body text-tertiary">
              六组基础配色统一使用 50–900 十级实色色阶。
            </p>
          </div>
          {palettes.map((palette) => (
            <div key={palette.token} className="space-y-4">
              <h4 className="font-medium">
                {palette.name}{" "}
                <code className="ml-2 font-mono text-label text-tertiary">
                  {palette.token}
                </code>
              </h4>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {levels.map((level) => {
                  const token = `${palette.token}-${level}`;
                  return (
                    <div key={token} className="min-w-0 space-y-2">
                      <div
                        data-palette-token={token}
                        title={`--${token}`}
                        className="h-12 rounded-lg border border-control-border"
                        style={{ backgroundColor: `var(--${token})` }}
                      />
                      <p className="text-center font-mono text-label text-tertiary">
                        {level}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="space-y-3 border-t border-divider pt-6">
            <h4 className="font-medium">图表分类色</h4>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (number) => (
                  <div key={number} className="space-y-2">
                    <div
                      className="h-10 rounded-lg"
                      style={{ backgroundColor: `var(--chart-${number})` }}
                    />
                    <p className="text-center font-mono text-label text-tertiary">
                      chart-{number}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="typography-title" className="space-y-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-label text-tertiary">02</span>
          <h2 id="typography-title" className="text-title font-semibold">
            文字层级
          </h2>
        </div>
        <div className="space-y-6 rounded-2xl bg-surface p-6">
          <div>
            <p className="text-display font-semibold tracking-tight">
              大标题文字示例
            </p>
            <p className="mt-1 font-mono text-label text-tertiary">
              Display · 40 / 50 · 600
            </p>
          </div>
          <div>
            <p className="text-title font-semibold">标题文字示例</p>
            <p className="mt-1 font-mono text-label text-tertiary">
              Title · 24 / 33.6 · 600
            </p>
          </div>
          <div>
            <p className="text-body">
              正文保持舒适行距，用于消息、表单说明和常规内容。
            </p>
            <p className="mt-1 font-mono text-label text-tertiary">
              Body · 14 / 23.1 · 400
            </p>
          </div>
          <div>
            <p className="text-label text-tertiary">辅助文字与元信息</p>
            <p className="mt-1 font-mono text-label text-tertiary">
              Label · 12 / 18 · 400
            </p>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl bg-surface p-6">
          <h3 className="font-semibold">四级文字颜色</h3>
          <p className="text-label text-tertiary">
            主要文字与主按钮背景同色，其余层级随主题使用基础灰阶。
          </p>
          {textColors.map(({ level, label, className }) => (
            <p
              key={level}
              data-text-level={level}
              className={`flex flex-wrap items-baseline justify-between gap-2 ${className}`}
            >
              <span>{label}</span>
              <code className="font-mono text-label">text-{level}</code>
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="geometry-title" className="space-y-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-label text-tertiary">03</span>
          <h2 id="geometry-title" className="text-title font-semibold">
            间距与形状
          </h2>
        </div>
        <div className="space-y-7 rounded-2xl bg-surface p-6">
          <div className="space-y-3">
            <p className="text-body font-medium">4px 基础网格</p>
            <div className="flex flex-wrap items-end gap-5">
              {[4, 8, 12, 16, 24, 32].map((size) => (
                <div key={size} className="space-y-2 text-center">
                  <div
                    className="mx-auto rounded-lg bg-primary"
                    style={{ width: size, height: size }}
                  />
                  <p className="font-mono text-label text-tertiary">{size}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid auto-rows-fr grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-muted px-3 py-5 text-center">
              <p className="font-mono text-body">rounded-lg</p>
              <p className="text-label text-tertiary">表单、下拉浮层 · 8px</p>
            </div>
            <div className="rounded-2xl bg-surface-muted px-3 py-5 text-center">
              <p className="font-mono text-body">rounded-2xl</p>
              <p className="text-label text-tertiary">卡片 · 16px</p>
            </div>
            <div className="rounded-3xl bg-surface-muted px-3 py-5 text-center">
              <p className="font-mono text-body">rounded-3xl</p>
              <p className="text-label text-tertiary">大弹层 · 24px</p>
            </div>
            <div className="rounded-full bg-surface-muted px-3 py-5 text-center">
              <p className="font-mono text-body">rounded-full</p>
              <p className="text-label text-tertiary">胶囊 · 全圆角</p>
            </div>
          </div>
          <p className="text-body text-tertiary">
            内容区域保持扁平，表单默认描边，浮层使用阴影。常规交互过渡为
            150ms，弹层使用进出和手势动画，尊重系统的减少动态效果设置。
          </p>
        </div>
      </section>

      <section aria-labelledby="buttons-title" className="space-y-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-label text-tertiary">04</span>
          <h2 id="buttons-title" className="text-title font-semibold">
            按钮与反馈
          </h2>
        </div>
        <div className="space-y-6 rounded-2xl bg-surface p-5 sm:p-8">
          <ButtonExamples />
          <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-label leading-6">
            <code>{`import { Button } from "./components/ui/button";

<Button>保存设置</Button>
<Button variant="secondary">取消</Button>
<Button variant="danger" size="sm">删除</Button>`}</code>
          </pre>
        </div>
      </section>

      <ComponentExamples />
    </main>
  );
}

export default DesignSystem;
