# Camua UI 视觉规范

预览通过可选的 `DesignSystem` 组件挂载到自己的页面。按真实业务需要增量扩展变量和组件。

## 视觉方向

- 内容区域保持扁平，以留白和轻微底色差组织内容。表单控件默认使用透明底与浅色细边框；所有浮层取消容器边框，用阴影区分层级。
- 主操作在亮色主题使用 `#111111` 配白字，暗色主题使用 `#f3f3f3` 配 `#111111` 深色文字。
- 按钮和 Avatar 默认 `rounded-full`；Avatar 的 `shape="square"` 使用 `rounded-lg`（8px），所有头像均有 1px 中性细边框；表单项默认 `rounded-lg`（Tailwind 默认 8px），Card 为 `rounded-2xl`（16px）；Menu、Select、Popover、Tooltip 为 8px 圆角，大弹层为 24px 圆角，不另建圆角主题变量。
- 强调色及状态色使用用户提供的基础色阶，避免给每个场景重复增加别名。

## 基础变量

`styles/camuaui/theme.css` 保存用户提供的亮暗基础配色，并通过 `@theme inline` 映射为 Tailwind 类。

| 原参考层级 | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |
| ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 项目层级   | 50  | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |

- `gray`、`accent`、`error`、`warning`、`success`、`info` 各包含十级实色，保留参考色值；原 1、12 级已去除。
- 原基础图表色 `--chart-1` 到 `--chart-8`、遮罩 `--scrim` 保留；公共白色使用 `--white`。
- 不加入透明色阶和对比色变量。
- 亮暗主题共用变量名。无 `data-theme` 时跟随系统；根元素显式设置 `data-theme="light"` 或 `data-theme="dark"` 时优先采用指定主题。
- 系统暗色与显式暗色声明保持一致。预览页切换仅在当前页面会话生效。
- 主题切换即时更新颜色。UIProvider 在根 data-theme 或跟随系统的颜色模式变化时结束颜色、边框色、填充色和阴影过渡，避免页面与控件先后变色；正常悬停、滑块位移、指示器滑动及浮层透明度/缩放动画继续保留。

## 衍生变量按需增加

新增变量必须有实际组件或页面使用，不为未来场景预留变量，也不为了展示变量而制造使用场景。基础色阶直接通过 `bg-gray-100`、`text-error-900` 等工具类使用。

当前按已有组件使用以下颜色别名：

| 变量                      | 用途                                                    |
| ------------------------- | ------------------------------------------------------- |
| `--background`            | 页面背景                                                |
| `--background-hover`      | 轻量悬停底色，页面背景与次要组件背景的中间色             |
| `--divider`               | 分隔线，将控件边框以 60% 强度混入透明色，比边框更淡       |
| `--foreground`            | 默认文字，引用 `--primary`，与主按钮背景同色            |
| `--foreground-secondary`  | 次要文字，引用 `--gray-900`                             |
| `--foreground-tertiary`   | 描述文字，引用 `--gray-700`                             |
| `--foreground-quaternary` | 禁用文字，引用 `--gray-500`                             |
| `--surface`               | 当前内容面板背景                                        |
| `--surface-raised`        | Select、Menu、Popover、Modal、Dialog、Drawer、Toast 的浮层表面 |
| `--surface-muted`         | 次要按钮、Tabs 胶囊、Segmented 轨道、Avatar 等中性底色  |
| `--surface-hover`         | 中性悬停底色、Switch / Slider / Progress 轨道           |
| `--surface-highlight`     | 浮层选项高亮、操作底色；浮层内的 muted 使用此色         |
| `--control-border`        | 表单与 outline 按钮的细边框                             |
| `--control-border-hover`  | 表单中性悬停边框：亮色 gray-300，暗色 18% primary       |
| `--popup-shadow`          | 随主题切换的浮层阴影，通过 `shadow-popup` 使用          |
| `--primary`               | 主按钮、滑块进度等，亮色 `#111111` / 暗色 `#f3f3f3`     |
| `--danger-background` / `--danger-background-hover` / `--danger-background-active` | 危险按钮的实心红色默认、悬停、按下背景：error-700 分别混入 12% / 20% / 28% 黑色，两个主题保持一致 |
| `--danger-foreground` | 危险按钮文字：两个主题均为 white |
| `--primary-foreground`    | 主按钮内部文字、内嵌 Slider 胶囊，随主题适配            |

主题别名按当前使用的表面、边框、阴影和危险按钮状态增量提供。圆角、控件高度和动效直接使用 Tailwind 的 `rounded-lg`、`min-h-8`、`duration-150` 等现成工具类；堆叠和拖拽所需的运行时变量仅用于对应组件的局部计算。

暗色表面从页面 `#070707`、卡片 `#181818` 到浮层 `#262626` 依次区分；卡片仍无边框、无阴影，默认 variant="surface" 使用内容表面，variant="background" 使用页面背景，不新增颜色变量。次要组件背景为 `#262626`，悬停为 `#3d3d3d`；浮层内部的中性背景与高亮使用 gray-300 / gray-400 的中间色，避免再次和浮层同色。表单与 outline 按钮的中性细边框在亮色使用 gray-200（#e8e8e8），暗色采用 14% 主要文字色，随承载背景混合；保持 1px，不提高线条厚度。悬停时通过 control-border-hover 加深一级：亮色 gray-300，暗色 18% 主要文字色。聚焦、选中和错误状态保持各自的 accent / error 颜色；禁用组件不响应悬停。

## 文字与布局

- 文字颜色使用四级语义工具类，不按字号决定颜色；默认文字与标题为 primary。`text-foreground` 保留为 primary 的兼容别名。

| 工具类            | 用途                     | 亮色      | 暗色      |
| ----------------- | ------------------------ | --------- | --------- |
| `text-primary`    | 主要、默认文字、标题     | `#111111` | `#f3f3f3` |
| `text-secondary`  | 次要、副标题             | `#3d3d3d` | `#b7b7b7` |
| `text-tertiary`   | 描述、辅助说明、占位文字 | `#777777` | `#777777` |
| `text-quaternary` | 禁用内容                 | `#959595` | `#5a5a5a` |

- 描述子组件默认 tertiary，Tab 未激活项与分组副标题使用 secondary。禁用文字直接使用 quaternary，不再叠加整体透明度；Checkbox、Radio、Switch、Slider 等非文字形状仍可使用透明度表达禁用。主按钮和 Tooltip 的反色文字、状态色保留各自语义；Segmented 白色滑块上的选中文字固定为 `#111111`。
- 系统无衬线字体，代码使用等宽字体；无需下载远程字体。
- 当前页面使用 `text-display` 40px、`text-title` 24px、`text-body` 14px、`text-label` 12px，按已存在的页面保留这四种字号。
- 使用 Tailwind 的 4px 间距网格；常用 `gap-2/3/4/6/8`。
- Button、Input、Select、Combobox、InputNumber、Segmented 统一使用 sm/md/lg = 32/36/40px，默认 md（36px）。按钮内边距依次为 14/18/22px，纯图标按钮宽高一致。InputNumber 内部输入与加减按钮为 22/26/30px；Segmented 选项为 28/32/36px，加上两侧 2px 轨道内边距。Combobox 标签为 24/28/32px，保持 4px 同心留白。Tabs、Slider 保留 32px 操作区，Checkbox、Radio 保持紧凑比例。
- Tabs 默认使用胶囊变体：灰色次要背景指示器跟随激活项，其他项与容器透明。另有 `underline` 变体，用 16px 短下划线和半粗体文字标记激活项；未选中项为二级文字色，悬停和选中时使用一级文字色，禁用项保留禁用色；两种指示器均用 250ms 连续移动动画。
- Segmented 只有一种外观：灰色胶囊轨道、带轻微四周阴影的白色指示器，选中项为黑色文字。使用紧凑单行行高，由 flex 垂直居中文字，不额外偏移。共享 Tabs 的 250ms 指示器动画，使用 RadioGroup 的选择与键盘行为；亮暗主题下滑块均为白色。
- Select、Radio、Checkbox、Input、InputNumber 默认描边。表单聚焦时边框和 2px 焦点环均为 `accent-700`、0px 偏移，首帧立即生效，不对焦点边框或外框颜色做过渡，避免从文字颜色闪暗；Select 展开时保留这一状态。Radio 的选中圆点、Checkbox 的选中背景使用 accent。
- InputNumber 的加减按钮使用 3px 圆角，与容器 8px 圆角扣除 4px 内边距和 1px 边框后的内弧同心。
- Switch 选中背景为 `accent-700`，白色滑块；未选中轨道与 Slider 一样使用 `surface-hover` 中性背景，避免在暗色浮层中与容器同色。默认 md 为 36 × 20px、16px 滑块及位移；sm 为 28 × 16px、12px 滑块及位移，均保留 2px 内边距。
- Slider 的 `floating` 变体使用细轨道和无边框滑块，阴影向四周扩散，让顶部轮廓可见；`inset` 变体使用 16px 轨道与 24 × 12px 横向长条胶囊，四周保留 2px 同心间距。Track、Indicator 的 8px 圆弧与 Thumb 的 6px 圆弧共享圆心，包括单值、范围和最小 / 最大值处。水平操作区为 32px 高。
- Select、Menu、Popover、Tooltip、Modal、Dialog、Drawer、Toast 均无容器边框，使用共享 `shadow-popup`。亮色保留零偏移两层四周阴影：8px 模糊 / 4% 黑色与 28px 模糊 / 8% 黑色；暗色使用 24% / 32% 黑色阴影，辅以 4% 白色的 1px 内侧边缘阴影，配合浮层底色区分边界。Card 保持无边框、无阴影，不给整页增加发光轮廓。
- 浮层分两类：Select、Menu 下拉浮层使用 `rounded-lg`（8px）与 4px 内边距，菜单项圆角为 4px（rounded-sm），与浮层 8px 圆角和 4px 内边距形成同心关系；菜单项和分组标题左右内边距为 8px（px-2）；Popover、Tooltip 使用 `rounded-lg`（8px）；Drawer、Modal、Dialog、Toast 使用 `rounded-3xl`（24px），内容内边距统一为 24px。抽屉把手和弹层关闭按钮单独布局。
- 交互使用 `duration-150`，通过 `motion-reduce:transition-none` 尊重系统的减少动态效果设置。
- 弹层使用 Base UI 的进出状态；Toast 使用测量高度实现堆叠、悬停 / 聚焦展开与滑动关闭，Drawer 支持拖拽、停靠高度和手势速度相关的退出动画。复杂动作在 `styles/camuaui/overlay-motion.css` 中定义，不新增全局动效主题变量。
- Drawer 支持四方位，进出和关闭手势朝向所在边缘；嵌套时后方容器每层缩小 4%、露出 16px 边缘，按官方层数、最前层高度和手势进度连续恢复。保持 24px 圆角与内容内间距、无容器边框；固定页头页脚与可滚动内容分离。场景示例置于 drawer-examples.tsx。
- Select 使用 200ms 淡入 / 缩放与沿弹出方向的 8px 位移动画，关闭动画完成后卸载；减少动态效果时停止动画。

## 组件封装

组件放在 `src/components/ui/`。Base UI 提供键盘与无障碍行为；样式直接写在 TSX 的 Tailwind 类中，使用完整静态类名管理变体和尺寸。

使用 `@/lib/utils` 的 `cn()` 合并调用方样式，处理同组工具类冲突。自定义字号 `display/title/body/label` 已登记，新增实际使用的字号时同步更新配置。

复杂动画或难以阅读的选择器确需独立 CSS 时，使用 `@layer components`。业务页面优先复用已有组件，按需补充封装。

当前组件清单和组合用法见 [components.md](components.md)。弹层默认使用 Portal；输入与组合控件保留 Base UI 的标签、键盘、约束校验及状态回调。根布局的 `UIProvider` 提供 Tooltip 与 Toast 上下文，页面无需重复安装 Provider。

Input、Select、InputNumber、Checkbox、Radio 提供中性边框悬停反馈，焦点优先且首帧保持 accent。Switch 未选中轨道默认使用 surface-hover，悬停时混入 8% primary 加深反馈，选中轨道悬停使用 accent-800；Segmented 未选中项悬停使用 surface-hover，已选项保留白色指示器。Slider 悬停时浮动滑块加深四周阴影，内嵌滑块轻微变暗。

### Button

ModalFooter、DrawerFooter 内的按钮默认使用 md（36px）；DrawerContent 的 footer 插槽也自动采用这一默认值。显式传入 size 时以指定尺寸为准。

```tsx
import { Button } from "./components/ui/button";

<Button onClick={save}>保存设置</Button>
<Button variant="secondary">取消</Button>
<Button variant="outline">描边按钮</Button>
<Button variant="ghost" size="sm">查看详情</Button>
<Button variant="danger">删除账号</Button>
<Button disabled>暂不可用</Button>
<Button type="submit" size="lg">提交</Button>
<Button className="px-6 text-label">自定义外观</Button>
<Button onlyIcon size="sm" aria-label="添加"><PlusIcon /></Button>
```

- `variant`：`primary` / `secondary` / `outline` / `ghost` / `danger`，默认 `primary`。
- `size`：`sm` / `md` / `lg`，默认 `md`。
- 纯图标按钮使用 `onlyIcon`，可与任意 size 组合；横向内边距为 0、图标居中，宽度分别为 32 / 36 / 40px，与对应按钮高度一致。原 icon 尺寸已移除。
- 按钮使用普通字重 font-normal（400），不默认加粗。胶囊圆角、无阴影；outline 变体使用透明底与细边框，其余变体无边框。次要按钮使用灰色底，危险操作使用浅红底与深红字。
- 保留 Base UI 的 `ref`、事件、状态函数形式的 `className` 等属性。
- 保留键盘焦点环、悬停、按下和禁用反馈。图标按钮提供 `aria-label`。
- 提交表单显式使用 `type="submit"`；导航使用 Link。

- 可操作的菜单/选项使用 cursor-pointer，禁用项仍不可点击。大浮层关闭图标显示为 20px，保留 32px 点击区域和统一的 1.5 图标线宽。
