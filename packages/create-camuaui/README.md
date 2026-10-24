# create-camuaui

使用最新的官方脚手架创建 Next.js 或 Vite + React 项目，然后自动安装 Camua UI 组件、主题、UIProvider 和示例首页。

```sh
npm create camuaui@latest my-app
cd my-app
npm run dev
```

按提示选择框架、TypeScript/JavaScript、包管理器，以及是否将组件示例作为首页。关闭示例时提供简洁的按钮首页。

```sh
npm create camuaui@latest my-app -- --framework next --yes
npm create camuaui@latest my-app -- --framework vite --language js --yes
npm create camuaui@latest . -- --framework vite --yes
```

在已有 React 项目中运行时自动跳过框架创建，保留页面和入口内容，只安装组件。可显式使用 `--framework existing`；使用 `npx camuaui@latest update` 更新已安装的组件。已有项目的 Provider 和示例页面需要由应用自行接入。

`--dry-run` 只显示计划，不创建目录、不执行脚手架或安装依赖。新建项目要求空目录，已有文件不会被覆盖。`--skip-install` 仅生成源码，之后需要自行安装项目依赖。

框架初始化失败时保留生成目录以便检查，不会删除已有内容。组件更新前会备份旧文件。完整组件与主题配置参见 [camuaui](https://www.npmjs.com/package/camuaui)。
