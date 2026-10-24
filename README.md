# Camua UI

基于 Base UI、Tailwind CSS 4 的 React 组件源码安装器。设计风格为扁平化、弱边框，包含亮色/暗色主题。CLI 把组件复制到你的项目中，组件运行时不依赖 `camuaui`，可以直接修改源码。

支持 React 18/19，适用于 Next.js、Vite、Remix 等 React 项目。需要 Node.js 20.19+ 和支持 Tailwind 4 的现代浏览器。

npm 安装包中的 `dist/` 是打包压缩后的 CLI，`bin/` 仅保留启动入口；`registry/` 则有意保留 React 组件、示例和主题源码，用于复制到你的项目。CLI 的 `src/`、构建脚本、测试和源码映射不包含在 npm 安装包中，完整开发源码保存在 GitHub 仓库。

## 从新项目开始

```sh
npm create camuaui@latest my-app
cd my-app
npm run dev
```

按提示选择 Next.js（App Router）或 Vite + React、TypeScript / JavaScript、包管理器和示例首页。初始化调用官方最新版脚手架，安装最新框架和所需 UI 依赖，自动引入 CSS、接入 UIProvider 并配置首页。默认首页显示组件示例；关闭示例时提供简洁的按钮首页。创建完成后自行运行 dev 命令，不会自动启动服务器。

```sh
npm create camuaui@latest my-app -- --framework next --yes
npm create camuaui@latest my-app -- --framework vite --language js --yes
npm create camuaui@latest . -- --framework vite --yes
```

新建项目必须使用空目录，CLI 不会覆盖已有项目。在已有 React 项目中运行 `npm create camuaui@latest` 时自动识别并跳过框架创建，也可指定 `--framework existing`。此时只执行下述组件安装流程，不替换已有页面或自动添加 Provider。Next.js、Vite、Remix 等现有 React 项目均可使用。

`--yes` 跳过交互，新项目默认 Vite、TypeScript 和示例首页。`--dry-run` 只展示计划，不创建目录、不执行框架脚本、不安装依赖；`--skip-install` 仅生成源码，之后需自行安装依赖。框架创建失败时保留目录以便检查，不自动删除。项目已创建但 UI 安装失败时可使用下面的组件安装命令重试，并按 Provider 章节接入首页。

`create-camuaui` 仅是 npm create 解析所需的稳定入口，每次通过 npm 获取最新版 `camuaui` 并执行主包的 `create-camuaui` 命令别名。CLI、组件和示例都只在主包中维护；入口包不绑定主包版本，后续正常更新只需发布 `camuaui`。

## 在已有项目中安装与更新

在已有 React 项目的根目录执行：

```sh
npx camuaui@latest
```

首次运行会询问组件目录、全局 CSS 入口、源码语言、包管理器，以及**是否添加 DesignSystem 示例组件**。示例默认不添加；选择添加后才会复制示例源码，不会创建页面或路由。

终端中用青色区分步骤和询问、绿色表示成功、黄色表示警告、红色表示错误。重定向输出时自动使用纯文本；可通过 `NO_COLOR=1` 关闭颜色，或 `FORCE_COLOR=1` 强制启用。`--version` 和 `list` 始终输出纯文本。

CLI 自动完成：

- 复制全部组件、工具函数、主题和动效 CSS，生成 `camuaui.json`。
- 检测缺失依赖，使用项目的 npm、pnpm、yarn 或 bun 安装 `@base-ui/react@latest`、`tailwindcss@latest` 等所需依赖。已有兼容版本保留；低于 1.9 的 Base UI 会升级。Tailwind 3 / React 17 等不支持的版本会明确报错，需要先迁移。
- 复用已有 Tailwind Vite/PostCSS 集成；未配置时使用通用的 `@tailwindcss/postcss`，补齐依赖并写入配置。复杂的动态配置请手动集成后使用 `--no-configure`。
- 在全局 CSS 中加入必要的 import，在能识别的 React 入口引入全局 CSS。找不到入口时给出提示。
- 在 `package.json` 中添加 `ui` 脚本；已有同名自定义脚本时改用 `ui:sync`，不覆盖原脚本。

更新组件时，执行以下任一命令，从最新版 npm 包重新拉取并覆盖组件：

```sh
npm run ui
npx camuaui@latest update
```

更新沿用 `camuaui.json` 中的路径和示例选择。覆盖前，旧文件默认备份到 `.camuaui/backups/时间戳/`。仅管理自己的源文件，不删除同目录下自行添加的其他组件。关闭示例时只移除原来安装的示例文件。直接修改生成的组件、主题会被下次同步覆盖，请先保存需要保留的改动。

源码写入失败会回滚本次文件修改；包管理器已安装的依赖和 lockfile 不在文件回滚范围内。

### 安装时的包管理器提示

CLI 会保留 npm、pnpm、yarn 或 bun 的原始安装日志。以下信息不代表 Camua UI 安装失败：

- `Verifying lockfile against supply-chain policies`：pnpm 正在校验锁文件和依赖的供应链策略。
- `Request took ...ms`：访问 registry 的请求较慢；若安装随后成功，无需重新安装。持续缓慢时检查网络、代理和 registry 连接。
- `deprecated ... outside the range you declared`：项目依赖已弃用，较新的版本超出了项目声明的版本范围。检查对应依赖及插件兼容性后再升级；CLI 不会替项目迁移 ESLint 等无关工具的主版本。

以最终退出状态为准：依赖安装失败时 CLI 返回非零状态，且不会写入本次组件源码。

## 生成目录

默认优先使用 `src/`，无 `src/` 时使用现有 `app/`，否则使用根目录。以下以 Vite / `src` 项目为例：

```text
src/
  components/
    ui/                    # 组件与 UIProvider
    camuaui-examples/       # 仅选择添加示例时生成
      index.tsx            # DesignSystem
      examples.tsx
      component-examples.tsx
      drawer-examples.tsx
      menu-examples.tsx
      context-menu-examples.tsx
      combobox-examples.tsx
      size-examples.tsx
      input-examples.tsx
      scroll-area-examples.tsx
      list-examples.tsx
      page-stack-examples.tsx
      nested-modal-examples.tsx
  lib/camuaui.ts            # cn：clsx + tailwind-merge
  styles/camuaui/
    index.css              # 样式入口和 Tailwind 扫描路径
    theme.css              # 基础色板、语义变量、Tailwind 映射
    base.css               # 基础排版与 focus
    overlay-motion.css     # 浮层、Toast、Drawer 动画
camuaui.json
.camuaui/manifest.json       # 已同步文件清单
```

选择 JavaScript 时输出 `.jsx` / `.js`，不会留下 TypeScript 类型。组件内部引用自动按目标目录改写为相对路径，不要求 `@/` 别名。

## 引入 CSS

默认 CLI 自动接入。手动配置或使用 `--no-configure` 时，在项目全局 CSS 中加入（相对路径以实际目录为准）：

```css
@import "tailwindcss";
@import "./styles/camuaui/index.css";
```

全局入口只需引入一次 Tailwind。若已有 `@tailwindcss/vite` 或 `@tailwindcss/postcss`，继续沿用；不要重复启用两套编译插件。组件的 `index.css` 不再次引入 Tailwind。

未配置 Tailwind 构建时，可安装 `tailwindcss@latest @tailwindcss/postcss@latest postcss@latest` 并创建：

```js
// postcss.config.mjs
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

`styles/camuaui/index.css` 含 `@source`，会扫描生成的组件和已选择的示例；CLI 会按自定义输出路径调整。

## 在根组件使用 Provider

`UIProvider` 统一提供 Tooltip、Toast 和层级隔离，并在主题变化时让颜色立即切换。它不会管理应用的主题状态。只包裹页面内容，不要包住 `<html>`。以下路径按默认布局书写，自定义目录时调整 import 即可。

### Next.js App Router

```tsx
// app/layout.tsx（使用 src/app 时组件仍位于 src/components）
import "./globals.css";
import { UIProvider } from "./components/ui/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
```

上例适用于根目录有 `app/`、无 `src/` 的默认输出。如果是 `src/app/layout.tsx`，默认 Provider import 为 `../components/ui/provider`。交互组件自带 `"use client"`，根布局可以保持 Server Component。

### Vite

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { UIProvider } from "./components/ui/provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </StrictMode>,
);
```

JavaScript 项目去掉 TypeScript 的 `!`。

### Remix（Vite）

```tsx
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./styles.css";
import { UIProvider } from "./components/ui/provider";

export default function App() {
  return (
    <html lang="zh-CN">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <UIProvider>
          <Outlet />
        </UIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

保留项目原有的文档结构、路由和错误处理。其它 React 框架也采用同样的方式：全局加载 CSS，在根内容周围放置 `UIProvider`。

## 按需使用组件

Button、Input、InputOTP、Select、Combobox、Autocomplete、InputNumber、Segmented 统一支持 `size="sm" | "md" | "lg"`，分别为 32 / 36 / 40px，默认 md（36px）。按钮左右内边距分别为 14 / 18 / 22px，onlyIcon 宽高与尺寸一致。Switch 支持 sm（28 × 16px）与默认 md（36 × 20px）；其它组件保持原尺寸。Select、Combobox、InputNumber 和 Segmented 在根组件设置 size，内部元素自动继承；SelectTrigger、ComboboxInputGroup/Trigger、InputNumberGroup 可单独覆盖。Autocomplete 与 InputOTP 同样从根组件继承尺寸；Input 直接设置 size。Avatar 统一为 40px，不提供 size 参数。Menu / Combobox 浮层搜索框仍为 36px。Card 圆角为 16px；下拉浮层圆角 8px、内边距 4px，菜单项圆角 4px、左右内边距 8px。

```tsx
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export function Example() {
  return (
    <div className="space-y-4">
      <Input aria-label="名称" placeholder="默认 36px" />
      <Input size="sm" aria-label="紧凑名称" placeholder="32px" />
      <Input size="lg" aria-label="大号名称" placeholder="40px" />
      <Button>保存</Button>
      <Button variant="outline">取消</Button>
    </div>
  );
}
```

提供 Button、Select、Combobox、Autocomplete、Switch、Input、InputOTP、InputNumber、Card、Tabs、Segmented、Tooltip、Toast、Slider、Progress、Popover、Menu、ContextMenu、Form、FieldSet、Field、Drawer、Modal、Dialog、PageStack、List、Empty、ScrollArea、Checkbox、Radio、CheckboxGroup、RadioGroup、Avatar 和 UIProvider。运行 `npx camuaui@latest list` 查看注册列表。API 和完整组合用法可查看 [组件说明](docs/components.md) 或可选示例源码。

Modal、Dialog、Drawer 的页脚使用 `ModalFooter` / `DialogFooter` / `DrawerFooter`，其中的按钮默认中号 md（36px），可通过 size 显式覆盖。DrawerContent 的 footer 插槽也自动采用中号按钮默认值。

普通弹窗使用 `Modal`（来自 `modal.tsx`），操作确认使用 `Dialog`（来自 `dialog.tsx`，基于 Base UI AlertDialog）。旧版 `Dialog*` 普通弹窗需迁移为 `Modal*` 并修改导入路径；CLI 不会修改应用的业务引用。详细迁移和新组件用法见[组件说明](docs/components.md)。

## 可选 DesignSystem 示例

```sh
# 添加或更新示例
npx camuaui@latest --examples

# 移除已安装的示例
npx camuaui@latest update --no-examples
```

添加后，在自己选择的页面内渲染：

```tsx
import { DesignSystem } from "./components/camuaui-examples";

export default function PreviewPage() {
  return <DesignSystem />;
}
```

页面需要位于 `UIProvider` 内。示例包含色板、四级文字、主题切换和全部组件演示，包括四个方向、嵌套、堆叠、snap points 等 Drawer 示例，以及独立 Menu 卡片中的分组、子菜单、单选、多选、悬停、过滤等 12 个场景，以及 Combobox 的 9 个场景（类型封装、ID 值、多选、浮层搜索、分组、异步单选/多选、创建选项、虚拟列表）。虚拟列表使用 `@tanstack/react-virtual`，CLI 只在添加示例时补装该依赖。异步搜索使用本地模拟请求，无需配置服务端。它是普通 React 组件，可用于任何路由系统；关闭示例不会影响 UI 组件。

## 主题与自定义变量

分隔线使用 `--divider`（`bg-divider`、`border-divider`、`divide-divider`），比控件边框更淡。轻量悬停底色使用 `--background-hover`（`hover:bg-background-hover`），取页面背景与次要组件背景的中间色。两者自动随亮色、暗色和系统主题变化，可在自己的主题中覆盖。可选 DesignSystem 包含会话列表示例：头像、名称与描述、右侧操作菜单、项间分隔线以及悬停和选中反馈。

默认跟随系统主题，支持在 `<html>` 上明确指定：

```js
document.documentElement.dataset.theme = "light";
document.documentElement.dataset.theme = "dark";
delete document.documentElement.dataset.theme; // 跟随系统
```

SSR 项目可在服务端读取 cookie 并设置 `data-theme`，避免首次渲染后再切换。主题属性应放在 `<html>` 上，确保 Portal 中的浮层继承相同变量。

`UIProvider` 会在根元素的 `data-theme` 变化或跟随系统主题切换时结束正在进行的颜色、边框色及阴影过渡，让页面和控件同步更新。平时的悬停反馈、开关滑块、Tabs / Segmented 指示器和浮层进出动画保持原有行为。

基础色板为 `--gray-50` 到 `--gray-900`，以及 accent、error、warning、success、info 的同级变量；无 `--th-`、alpha、contrast 色板。主色 `--primary` 亮色为 `#111111`，暗色为 `#f3f3f3`。四级文字对应 `--foreground`、`--foreground-secondary`、`--foreground-tertiary`、`--foreground-quaternary`，工具类为 `text-primary`、`text-secondary`、`text-tertiary`、`text-quaternary`。

**建议在自己的 CSS 中覆盖变量，放在生成目录外，避免更新覆盖。** 在全局 CSS 中按顺序引入：

```css
@import "tailwindcss";
@import "./styles/camuaui/index.css";
@import "./theme-overrides.css";
```

```css
/* src/theme-overrides.css：不放入 @layer，可覆盖默认 base 层 */
:root {
  --accent-700: #7c3aed;
  --accent-800: #6d28d9;
  --accent-900: #5b21b6;
}

:root[data-theme="dark"] {
  --accent-700: #a78bfa;
  --accent-800: #c4b5fd;
  --accent-900: #ddd6fe;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --accent-700: #a78bfa;
    --accent-800: #c4b5fd;
    --accent-900: #ddd6fe;
  }
}
```

需要完整品牌色时覆盖整套 50–900 色阶。现有 Tailwind 映射可直接使用 `bg-accent-700`、`text-primary`、`text-secondary`、`bg-surface`、`shadow-popup` 等类；添加自己的新变量时，在项目 CSS 中用 Tailwind 4 `@theme inline` 映射到对应工具类。

## CLI 参数

```sh
npx camuaui@latest --help
npx camuaui@latest --yes --examples --language ts
npx camuaui@latest --dry-run
npx camuaui@latest --components src/shared/ui --styles src/styles/camuaui
```

| 参数                                     | 用途                                                     |
| ---------------------------------------- | -------------------------------------------------------- |
| `init` / `update` / `sync`               | 同步全部组件，重复执行会覆盖受管理源码                   |
| `list`                                   | 查看组件列表，不修改项目                                 |
| `-y`, `--yes`                            | 使用已有配置或默认值，跳过交互；非交互终端同样使用默认值 |
| `--cwd <目录>`                           | 目标 React 项目根目录，必须有 package.json               |
| `--components <目录>`                    | 组件目录                                                 |
| `--utils <文件>`                         | cn 工具文件                                              |
| `--styles <目录>`                        | 主题与动效目录                                           |
| `--css <文件>`                           | 全局 CSS 入口                                            |
| `--entry <文件>`                         | 导入全局 CSS 的 React 入口模块                           |
| `--language ts\|js`                      | 输出 TypeScript 或 JavaScript/JSX                        |
| `--package-manager npm\|pnpm\|yarn\|bun` | 指定包管理器                                             |
| `--examples` / `--no-examples`           | 添加或移除受管理的示例代码                               |
| `--examples-path <目录>`                 | 示例目录                                                 |
| `--skip-install`                         | 跳过依赖安装                                             |
| `--no-configure`                         | 仅同步源码，不修改 CSS/构建/入口配置；需自行接入 CSS     |
| `--no-backup`                            | 关闭覆盖前备份                                           |
| `--dry-run`                              | 查看文件与依赖计划，不写入或安装                         |

除 `--cwd` 外，输出路径相对于目标项目，使用 `/` 分隔。CLI 拒绝越界路径、符号链接输出目录和保留目录。参数会写入 `camuaui.json`，后续同步沿用；要重新开启 `configure` / `backup`，在配置中改回 `true`。
