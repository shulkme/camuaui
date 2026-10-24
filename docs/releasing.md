# 源码提交与 npm 发布

源码仓库：https://github.com/shulkme/camuaui

普通提交推送到 main 后，GitHub Actions 自动执行类型检查、测试、CLI 构建、安装包检查和预览构建。只有 camuaui 出现未发布的新版本时才发布主包，并校验 registry 的安装包摘要。PR 只检查，不发布。

## 首次设置

先发布带有 create-camuaui 命令别名的 camuaui 主包，再单独发布一次 create-camuaui 稳定入口。入口包每次调用最新版主包，不含组件或 CLI 主体，也不绑定主包版本。后续正常更新无需再发布入口包；只有转发逻辑本身变更时才单独升级入口。

在 npm 的 camuaui 主包设置中添加 Trusted Publisher：

- Organization/user：`shulkme`
- Repository：`camuaui`
- Workflow filename：`publish.yml`
- 启用 **Allow npm publish**。
- 不设置 Environment（当前工作流没有使用 GitHub Environment）。

主包使用 npm 的 OIDC 可信发布，不在仓库保存长期密钥。首次发布和权限配置可能需要维护者完成 npm 的浏览器验证。主包尚未建立时，工作流会提示需要首次发布，检查照常运行。入口包不属于自动发布列表，不需要为普通主包更新配置它的发布权限。

## 后续版本

先提交组件、CLI 或文档的源码改动，在 main 分支工作区干净时执行：

```sh
npm run release -- patch
# 或 minor / major / 指定稳定版本，例如 0.3.0
```

脚本只更新主包版本和 registry，检查并打包，提交版本变更，然后推送 main。推送失败时不会执行 npm 发布。GitHub Actions 在已推送的提交上检查并发布主包；安装包不提交 Git。相同版本会跳过，失败后可以重新运行 Actions。入口包的版本与主包相互独立。

自动流程当前发布稳定的 x.y.z 版本。已经发布的版本不可覆盖；源码变更需要发布时，请增加版本号。`dist/` 是构建生成的 CLI，`registry/` 是需要注入项目的组件源码；`src/` 只进入 Git，不进入 npm 包。

参考：[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)。
