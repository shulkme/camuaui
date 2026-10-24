# 组件使用

在可选 `DesignSystem` 组件的“组件与交互”区域可体验全部组件。组件按配置输出（默认 `src/components/ui/`），按文件导入；共享主题见 [visual-guidelines.md](visual-guidelines.md)。

请在根内容接入 `UIProvider`，提供 Tooltip、Toast 上下文。Card、Empty 等展示组件不依赖客户端运行时，交互组件在各自文件内声明客户端边界。

表单项默认采用透明底与细边框；未聚焦时悬停边框加深一级（亮色 gray-300，暗色 18% primary），禁用项不响应；聚焦时边框和 2px 焦点环均立即使用 accent-700，且无偏移，不经过深色过渡。所有浮层采用无边框、零偏移四周阴影：Select、Menu 下拉浮层为 8px 圆角、4px 内边距，Popover、Tooltip 为 8px 圆角，大弹层为 24px 圆角与内容内边距。支持 Base UI 进出状态与减少动态效果偏好。

表面样式按语义使用：Card 为 `bg-surface`，浮层为 `bg-surface-raised shadow-popup`；次要按钮、Tabs 胶囊和 Segmented 轨道为 `bg-surface-muted`，悬停为 `bg-surface-hover`，浮层项高亮为 `bg-surface-highlight`。浮层内部将 muted 指向 highlight，保证嵌套按钮也与容器区分。表单与 outline 按钮的中性描边使用 `border-control-border`：亮色为 gray-200（#e8e8e8），暗色为 14% 主要文字色。暗色通过表面色差、轻微内侧边缘阴影与柔和黑色阴影区分浮层，Card 的暗色内容表面为 gray-200（#181818），与页面 gray-50（#070707）拉开色差，次要组件和浮层仍为 gray-300（#262626）。Card 仍无边框、无阴影；亮色延续原有配色。

文字颜色使用 `text-primary`（主要、默认、标题）、`text-secondary`（次要、副标题）、`text-tertiary`（描述、占位）、`text-quaternary`（禁用）。默认文字与主按钮背景同色：亮色 #111111，暗色 #f3f3f3；描述子组件默认 tertiary。禁用文字不用整体 opacity 再次衰减，禁用 Button 使用中性浅底与 quaternary 文字。反色内容与状态文字保留各自配色。完整色值见 [visual-guidelines.md](visual-guidelines.md)。

## Button / Switch 尺寸与变体

```tsx
<Button variant="outline">描边按钮</Button>
<Button><PlusIcon />新建项目</Button>
<Button variant="outline">展开选项<ChevronDownIcon /></Button>
<Button onlyIcon size="sm" aria-label="添加"><PlusIcon /></Button>
<Button onlyIcon size="lg" aria-label="关闭"><CloseIcon /></Button>
<Switch defaultChecked /> {/* 默认 md：36 × 20px */}
<Switch size="sm" /> {/* 28 × 16px */}
```

Button 保留 primary、secondary、ghost、danger，新增 outline。Switch 未选中轨道与 Slider 一样使用 bg-surface-hover，悬停时混入 8% primary；选中背景使用 accent-700，悬停使用 accent-800，两档尺寸均保留受控状态、禁用与键盘行为。

图标与文字可以直接作为 Button 子节点，图标放在文字前或后均可。默认图标为 16px、间距 8px；带文字时无需 `onlyIcon`。可选 DesignSystem 的“图标与文字”区域提供三种尺寸和变体的示例。

Button 所有尺寸与变体默认使用 font-normal（400）字重。size 仅为 sm / md / lg，分别为 32 / 36 / 40px，默认 md（36px）；左右内边距分别为 14 / 18 / 22px。Input、InputOTP、Select、Combobox、Autocomplete、InputNumber、Segmented 同样支持 sm/md/lg，默认 md 为 36px；Tabs 和 Slider 保留 32px 基准。Card 使用 rounded-2xl（16px），Menu、Select 下拉浮层使用 rounded-lg（8px），Modal、Dialog、Drawer、Toast 保留 rounded-3xl（24px）。Card 支持 variant="surface"（默认内容表面）和 variant="background"（页面背景）。纯图标按钮通过 onlyIcon 与 size 组合：宽高分别为 32 / 36 / 40px，px-0，居中排列；提供 aria-label。原 size="icon" 调用改为 onlyIcon（默认 md）；className 仍可覆盖默认样式。

## 清单

卡片背景使用现有主题变量，不增加新颜色：

```tsx
<Card>默认内容表面</Card>
<Card variant="background">页面背景</Card>
```

| 组件 / 文件                          | 组合接口与行为                                                                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Select / `select.tsx`                | Select、SelectLabel、SelectTrigger、SelectValue、SelectContent、SelectItem、SelectGroup、SelectGroupLabel；根保留泛型、受控值与多选能力                |
| Combobox / `combobox.tsx` | Combobox（保留 Value / Multiple / Item 泛型）、ComboboxInputGroup、ComboboxInput、ComboboxTrigger、ComboboxClear、ComboboxContent、ComboboxList、ComboboxItem、ComboboxValue、ComboboxLabel、ComboboxEmpty、ComboboxStatus、ComboboxGroup、ComboboxGroupLabel、ComboboxCollection、ComboboxChips、ComboboxChip、ComboboxChipRemove、ComboboxSearchInput、createComboboxItems、useComboboxFilter、useComboboxFilteredItems |
| Switch / `switch.tsx`                | Switch；sm 为 28 × 16px，默认 md 为 36 × 20px；支持 checked、defaultChecked、onCheckedChange、disabled                                                                   |
| Input / `input.tsx`                  | Input；原生输入属性和 Base UI 的 Field 集成                                                                                                            |
| Card / `card.tsx`                    | Card、CardHeader、CardTitle、CardDescription、CardContent、CardFooter                                                                                  |
| Tabs / `tabs.tsx`                    | Tabs、TabsList、TabsTrigger、TabsContent；`variant="pill"`（默认）或 `"underline"`                                                                     |
| Segmented / `segmented.tsx`          | Segmented、SegmentedItem；单一样式，复用 RadioGroup / Radio 和 Tabs 的共享滑动指示器                                                                   |
| Tooltip / `tooltip.tsx`              | Tooltip、TooltipTrigger、TooltipContent、TooltipProvider                                                                                               |
| Toast / `toast.tsx`                  | toast 管理器、useToast、ToastProvider、Toaster、Toast；支持添加、关闭、更新、异步状态与 actionProps                                                    |
| Slider / `slider.tsx`                | Slider；variant 为 floating（默认）或 inset，自动生成单值 / 范围滑块。也导出 Label、Value、Control、Track、Indicator、Thumb 对应的 Slider 前缀子组件   |
| Progress / `progress.tsx`            | Progress、ProgressLabel、ProgressValue、ProgressTrack、ProgressIndicator；value 为 null 时表示不确定进度                                               |
| Popover / `popover.tsx`              | Popover、PopoverTrigger、PopoverContent、PopoverTitle、PopoverDescription、PopoverClose                                                                |
| InputNumber / `input-number.tsx`     | InputNumber、InputNumberGroup、InputNumberInput、InputNumberIncrement、InputNumberDecrement；基于 Number Field，支持步长、范围与格式化                 |
| Menu / `menu.tsx` | Menu、MenuTrigger、MenuContent、MenuItem、MenuLinkItem、MenuGroup、MenuGroupLabel、MenuSeparator、MenuCheckboxItem、MenuRadioGroup、MenuRadioItem、MenuSub、MenuSubTrigger、MenuSubContent、MenuFilterProvider、MenuInput、MenuClear、MenuEmpty、createMenuHandle |
| ContextMenu / `context-menu.tsx` | ContextMenu、ContextMenuTrigger、ContextMenuContent、ContextMenuItem、ContextMenuLinkItem、ContextMenuGroup、ContextMenuGroupLabel、ContextMenuSeparator、ContextMenuCheckboxItem、ContextMenuRadioGroup、ContextMenuRadioItem、ContextMenuSub、ContextMenuSubTrigger、ContextMenuSubContent；右键与长按菜单 |
| Form / `form.tsx`                    | Form；保留泛型、onFormSubmit、errors 与 validationMode                                                                                                 |
| FieldSet / `fieldset.tsx`            | FieldSet、FieldSetLegend；原生 fieldset / legend 分组                                                                                                  |
| Field / `field.tsx`                  | Field、FieldLabel、FieldDescription、FieldError、FieldControl、FieldValidity、FieldItem                                                                |
| Drawer / `drawer.tsx`                | Drawer、DrawerTrigger、DrawerContent、DrawerTitle、DrawerDescription、DrawerFooter、DrawerClose、DrawerSnapPoint 类型；底部抽屉，支持拖拽与 snapPoints |
| Modal / `modal.tsx`                | Modal、ModalTrigger、ModalContent、ModalTitle、ModalDescription、ModalFooter、ModalClose                                                        |
| Dialog / `dialog.tsx` | 基于 Base UI AlertDialog：Dialog、DialogTrigger、DialogContent、DialogTitle、DialogDescription、DialogFooter、DialogClose、DialogCancel、DialogAction、createDialogHandle；操作确认，不支持点击遮罩关闭 |
| InputOTP / `input-otp.tsx` | InputOTP、InputOTPSlot、InputOTPGroup、InputOTPSeparator；三种尺寸、数字/字母、粘贴、掩码和表单校验 |
| Autocomplete / `autocomplete.tsx` | Autocomplete、AutocompleteInput、AutocompleteInputGroup、AutocompleteTrigger、AutocompleteClear、AutocompleteContent、AutocompleteList、AutocompleteItem、AutocompleteEmpty、AutocompleteStatus、AutocompleteGroup、AutocompleteGroupLabel、AutocompleteCollection、AutocompleteRow、AutocompleteValue、AutocompleteSeparator、useAutocompleteFilter、useAutocompleteFilteredItems；自由文本输入建议 |
| ScrollArea / `scroll-area.tsx` | ScrollArea、ScrollAreaRoot、ScrollAreaViewport、ScrollAreaContent、ScrollAreaScrollbar、ScrollAreaThumb、ScrollAreaCorner；纵向/横向/双向滚动、悬停显示滚动条和渐变边缘 |
| PageStack / `page-stack.tsx` | PageStack、PageStackPage；受控内容切换、双向滑动、动态高度与状态保留 |
| List / `list.tsx` | List、ListItem、ListItemMedia、ListItemMeta（ListItemContent）、ListItemTitle、ListItemDescription、ListItemActions；头像/Logo、标题与描述、独立操作区 |
| Empty / `empty.tsx` | Empty、EmptyHeader、EmptyIcon、EmptyTitle、EmptyDescription、EmptyActions、EmptyExtra；无数据时的引导卡片 |
| Checkbox / `checkbox.tsx`            | Checkbox；支持选中、禁用、部分选中及 CheckboxGroup 的父复选框                                                                                          |
| Radio / `radio.tsx`                  | Radio；与 RadioGroup 配合使用                                                                                                                          |
| CheckboxGroup / `checkbox-group.tsx` | CheckboxGroup；以字符串数组管理多个 Checkbox 的 value                                                                                                  |
| RadioGroup / `radio-group.tsx`       | RadioGroup；保留 value 泛型与 onValueChange                                                                                                            |
| Avatar / `avatar.tsx`                | Avatar、AvatarImage、AvatarFallback；shape="circle"（默认圆形）/"square"（8px 圆角方形），统一细边框，支持加载失败回退                                                                               |

所有样式封装支持 `className` 覆盖，Base UI 组件也保留状态函数形式的 `className`、`render` 与 ref。保留各原语的事件签名和表单属性。Card 使用普通 HTML 属性。

## 选择与组合

```tsx
import {
  Select,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";

const items = [
  { value: "email", label: "Email" },
  { value: "telegram", label: "Telegram" },
];

<Select items={items} defaultValue="email" name="channel">
  <SelectLabel>渠道</SelectLabel>
  <SelectTrigger>
    <SelectValue placeholder="选择渠道" />
  </SelectTrigger>
  <SelectContent>
    {items.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>;
```

Select 的 items 用于显示值对应的标签。SelectContent、TooltipContent、PopoverContent、MenuContent 的 `positionerProps` 可调整 side、align、sideOffset 等定位选项；浮层自带 Portal。

Select 展开期间触发器边框与外环保持 accent；弹窗使用 200ms 淡入 / 缩放及沿弹出方向的位移动画，关闭完成后再卸载。Select、Menu 使用 8px 圆角、4px 容器内边距，菜单项圆角为 4px（rounded-sm），与浮层保持同心，菜单项和分组标题的左右内边距为 8px（px-2）；Popover、Tooltip 保留 8px 圆角；Drawer、Modal、Dialog、Toast 使用 24px 圆角和内容内边距。所有浮层共用更轻的零偏移四周阴影。

## Tabs 的两种变体

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

<Tabs defaultValue="all">
  {" "}
  {/* 默认 variant="pill" */}
  <TabsList aria-label="记录视图">
    <TabsTrigger value="all">全部</TabsTrigger>
    <TabsTrigger value="unread">未读</TabsTrigger>
  </TabsList>
  <TabsContent value="all">全部记录</TabsContent>
  <TabsContent value="unread">未读记录</TabsContent>
</Tabs>;
```

`pill`：列表与标签项透明，由单个胶囊指示器提供激活项的灰色次要背景，宽度随标签变化。`underline`：背景透明，由单个 16px 指示器居中标记激活项，激活文字使用 font-semibold，未激活项保持常规字重。两种变体均自动在 TabsList 中挂载 Base UI Indicator，使用 250ms 位置过渡；无需手动添加 Indicator。设置根的 `variant="underline"` 即可切换。减少动态效果时立即切换。

方向键、Home / End 移动焦点，Enter / Space 激活；在 TabsList 上设置 activateOnFocus 可改为焦点移动时自动激活。

## Segmented

```tsx
import { Segmented, SegmentedItem } from "./components/ui/segmented";

<Segmented defaultValue="all" aria-label="记录范围">
  <SegmentedItem value="all">全部</SegmentedItem>
  <SegmentedItem value="unread">未读</SegmentedItem>
  <SegmentedItem value="archived" disabled>
    归档
  </SegmentedItem>
</Segmented>;
```

只有灰色胶囊轨道、带轻微阴影的白色滑块这一种外观，不提供 variant。轨道内边距为 2px，sm/md/lg 选项高 28/32/36px，总高 32/36/40px，默认 md。选项使用 leading-none，由 flex 垂直居中文字，不额外偏移。与胶囊 Tabs 共用 SelectionIndicator，使用 250ms 的位置与宽度过渡，支持内容变化、尺寸变化、滚动及减少动态效果。亮暗主题都使用白色滑块与选中黑字。

行为基于项目 RadioGroup / Radio，保留真实的 radiogroup / radio 角色，每个 SegmentedItem 额外带 `data-role="radio"`。方向键切换并跳过禁用项，Space 选中。支持 value / onValueChange、defaultValue、name、form、disabled、readOnly、required、ref、className 及自定义可访问名称。

在项目 Form 中使用时，放入 `<Field name="filter">`，配合 FieldLabel 和 FieldError；各选项会保留独立名称。原生表单可直接通过 name 提交。预览包含受控表单、非受控和整组禁用示例。

## 标签与分组控件

```tsx
<label className="flex items-center gap-3"><Switch defaultChecked />自动更新</label>
<label className="flex items-center gap-3"><Checkbox />确认回复内容</label>

<CheckboxGroup name="channels" defaultValue={["email"]} aria-label="通知渠道">
  <label><Checkbox value="email" />Email</label>
  <label><Checkbox value="telegram" />Telegram</label>
</CheckboxGroup>

<RadioGroup name="mode" defaultValue="assisted" aria-label="运行模式">
  <label><Radio value="assisted" />手动处理</label>
  <label><Radio value="automatic" />自动处理</label>
</RadioGroup>
```

使用可访问名称（可见 label / FieldLabel 或 aria-label）。默认 Switch、Checkbox、Radio 原语使用 span，适合包裹式 label；如果需要原生 button 与 htmlFor 标签模式，使用 Base UI 支持的 `nativeButton` 和 `render` 属性。不要在原生 button 外包裹另一个交互按钮。

CheckboxGroup 传入 allValues 后，可使用 `<Checkbox parent />` 管理全选和部分选中。

## 表单与校验

```tsx
import { Form } from "./components/ui/form";
import { FieldSet, FieldSetLegend } from "./components/ui/fieldset";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "./components/ui/field";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

<Form onFormSubmit={(values) => save(values)}>
  <FieldSet>
    <FieldSetLegend>联系信息</FieldSetLegend>
    <Field name="email">
      <FieldLabel>邮箱</FieldLabel>
      <Input type="email" required />
      <FieldDescription>用于接收人工待办提醒。</FieldDescription>
      <FieldError match="valueMissing">请输入邮箱。</FieldError>
      <FieldError match="typeMismatch">邮箱格式不正确。</FieldError>
    </Field>
  </FieldSet>
  <Button type="submit">保存</Button>
</Form>;
```

默认在提交时校验，提交过后变更会重新校验；可设置 validationMode。onFormSubmit 只处理通过校验的提交，并自动阻止默认导航。服务端返回的错误可通过 Form 的 errors 传入；Field 的 validate 可补充业务校验。异步校验的提交策略遵循 Base UI，实际保存仍需服务端验证。

## 浮层

```tsx
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "./components/ui/modal";

<Modal>
  <ModalTrigger render={<Button variant="secondary" />}>编辑</ModalTrigger>
  <ModalContent>
    <ModalTitle>编辑项目</ModalTitle>
    <ModalDescription>填写项目基本信息。</ModalDescription>
    {/* 编辑内容 */}
    <ModalFooter className="mt-6">
      <ModalClose render={<Button />}>完成</ModalClose>
    </ModalFooter>
  </ModalContent>
</Modal>;
```

Trigger / Close 使用 `render={<Button />}` 组合已有按钮，避免产生嵌套 button。Popover、Menu、Tooltip、Drawer 使用相同组合方式。Modal 和 Drawer 提供标题与描述；默认渲染关闭图标，showCloseButton={false} 可隐藏。焦点限制、Esc 和关闭后的焦点恢复由 Base UI 处理。

Drawer 默认 `side="bottom"`，还支持 top / right / left，并自动同步定位、把手方向及滑动关闭方向。保留 swipeDirection 兼容用法；同时提供 side 时以 side 为准。输入控件、第三方拖拽区域可按 Base UI 的 `data-base-ui-swipe-ignore` 约定排除手势。

```tsx
<Drawer side="right">
  <DrawerTrigger render={<Button variant="secondary" />}>
    渠道设置
  </DrawerTrigger>
  <DrawerContent>
    <DrawerTitle>渠道设置</DrawerTitle>
    <DrawerDescription>配置渠道通知。</DrawerDescription>
    <DrawerFooter className="mt-6">
      <DrawerClose render={<Button />}>完成</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

```tsx
<Drawer snapPoints={[0.5, 1]} defaultSnapPoint={0.5}>
  <DrawerTrigger render={<Button variant="outline" />}>通知偏好</DrawerTrigger>
  <DrawerContent>
    <DrawerTitle>通知偏好</DrawerTitle>
    <DrawerDescription>拖动顶部把手可调整抽屉高度。</DrawerDescription>
    {/* 内容 */}
  </DrawerContent>
</Drawer>
```

竖向抽屉提供 snapPoints 时自动启用可拉伸高度与独立滚动内容区；不提供时使用自然内容高度，左右侧抽屉默认占满可用高度。支持 snapPoint / onSnapPointChange 受控停靠点、snapToSequentialPoints，以及 contentProps 调整滚动区。停靠偏移、拖拽阻尼、遮罩淡出和释放速度使用 [Base UI Drawer 的手势变量](https://base-ui.com/react/components/drawer#stacking-and-animations)。预览页保留“半屏 / 展开”，并增加 35% / 65% / 全高三段停靠按钮，便于键盘调整。

嵌套时将下一层 Drawer 放在父层内容内。没有 snapPoints 的抽屉默认启用 stacked：使用官方层数、最前层高度和手势进度变量，让后方抽屉每层缩小 4%、露出 16px 边缘，并在关闭时恢复；`stacked={false}` 可关闭视觉堆叠。父层保留挂载与表单值，最前层独立管理焦点；有 snapPoints 的抽屉不叠加此变换。

ModalFooter、DrawerFooter 内的 Button 默认使用 md（36px），不需要逐个指定 size；显式 size 优先。DrawerContent 的 footer 插槽同样自动提供中号默认值。正文按钮同样默认 md。

DrawerContent 的 `header` / `footer` 为固定插槽，`children` 为滚动内容；`showHandle`、`showCloseButton`、`showBackdrop` 控制把手、关闭图标与遮罩。`portalProps`、`viewportProps`、`backdropProps` 用于局部渲染。非模态 `modal={false}` 默认不显示遮罩，可加 disablePointerDismissal 保持外部点击时仍打开。

按官方能力导出 DrawerProvider、DrawerIndent、DrawerIndentBackground、DrawerSwipeArea、DrawerVirtualKeyboardProvider 和 createDrawerHandle。软键盘 Provider 必须放在 Drawer 内，包住 DrawerContent；页脚偏移使用 `var(--drawer-keyboard-inset, 0px)`。移动端自动化可验证布局与焦点，真实软键盘仍需在手机浏览器上检查。

可选 `DesignSystem` 组件的 Drawer 场景区覆盖[官方示例](https://base-ui.com/react/components/drawer#examples)：四方位、受控 / 非受控、三层不同高度堆叠、多段停靠、软键盘、局部页面缩进、非模态、移动导航、边缘滑出、关闭前确认、独立危险操作面板、分离触发器与 payload。关闭确认使用受控状态与 eventDetails.cancel() 拦截关闭请求；所有操作仅影响本地示例。

TooltipContent 使用文字提示，不放交互操作；触发器仍需提供可访问名称，关键说明使用可见文本或 Popover，遵循 [Base UI 的 Tooltip 使用约定](https://base-ui.com/react/components/tooltip#usage-guidelines)。MenuItem 用于操作，MenuLinkItem 用于导航。

## 通知

```tsx
import { toast } from "./components/ui/toast";

toast.add({ title: "设置已保存", description: "通知规则已更新。" });
const id = toast.add({ title: "正在同步", timeout: 0 });
toast.update(id, { title: "同步完成", timeout: 3000 });
toast.close(id);
```

也可在 Provider 内用 useToast() 获取管理器。默认最多显示 3 条、5 秒自动关闭；支持 actionProps、更新、promise 和手动关闭。不要在每个页面重复挂载 Toaster；根布局已挂载一次。

通知在右下角按测量高度堆叠，悬停或键盘聚焦时展开；可左右或向下滑动关闭。关闭动画结束后才卸载，超出 limit 的通知不可交互。堆叠使用 [Base UI Toast 的官方状态与尺寸变量](https://base-ui.com/react/components/toast#stacking-and-animations)，外观仍通过 Tailwind 设置；复杂动作位于 `styles/camuaui/overlay-motion.css` 的 components 层。

## 数值与进度

```tsx
<InputNumber min={0} max={5} step={1} defaultValue={2} inputProps={{ "aria-label": "重试次数" }} />
<Slider defaultValue={40} aria-label="音量" />
<Slider variant="inset" defaultValue={60} aria-label="提示音量" />
<Slider variant="inset" defaultValue={[20, 80]} thumbLabels={["下限", "上限"]} />
<Progress value={65} aria-label="同步进度" />
<Progress value={null} aria-label="正在连接" />
```

Slider 默认自动生成对应数量的 Thumb；传入 children 可使用导出的组合子组件自定义标签与轨道。范围滑块每个 Thumb 应有不同名称；自定义 Thumb 时提供 index 以支持服务端渲染。Progress 可使用 Label、Value、Track、Indicator 子组件组合进度文字。

InputNumber 外框 sm/md/lg 为 32/36/40px，内部输入与加减按钮为 22/26/30px，默认 md，使用 3px 圆角，与容器的 8px 外圆角、4px 内边距和 1px 边框形成同心关系；不使用胶囊圆角。

floating：细轨道、20px 圆形悬浮滑块，无边框、使用零偏移四周阴影。inset：16px 轨道、24 × 12px 横向长条胶囊，Track / Indicator 圆弧半径 8px，Thumb 半径 6px，三者保持同心与 2px 间隔；水平操作区为 32px。Indicator 的可见填充会延伸到胶囊外缘再加 2px，使其圆弧与 Thumb 共享圆心；轨道两端各超出 Base UI Control 2px，配合默认 thumbAlignment="edge" 保证最小 / 最大值处的间距。范围两端采用相同几何，垂直方向对调宽高。两种变体均支持调用方 className 覆盖。

两种 Slider 的 Thumb 悬停均显示手形指示光标，禁用时显示不可操作光标；内部原生输入继承光标样式。

## Menu 场景与扩展

独立 Menu 示例卡片包含 12 个场景：基础/禁用、分组、多级子菜单、单选、多选、关闭行为、悬停、链接与弹窗、分离触发器、受控多触发器、箭头与动画、搜索过滤。参考 [Base UI Menu 示例](https://base-ui.com/react/components/menu#examples)，操作结果只保存在本地示例状态。

嵌套菜单使用 MenuSub、MenuSubTrigger、MenuSubContent；浮层和菜单项复用现有圆角、间距与动画。通过 createMenuHandle 关联分离的 MenuTrigger 与 Menu，并使用 payload 传递上下文；受控多触发器同时管理 open 和 triggerId。

过滤使用 MenuFilterProvider、MenuInput、MenuClear、MenuEmpty；搜索框放在 MenuContent 的 header 插槽，高度为 36px，紧贴浮层顶部与左右边缘，上方圆角为 8px、下方无圆角；默认只显示底部分隔线，聚焦时为四边统一的 2px accent 高光，使用 -3px outline-offset 内收，在浮层边缘内侧留出 1px 间距；分隔线保留中性色，避免底部叠加变粗，并带搜索图标。带 header 时浮层无外内边距，内部 List 保留 4px 内边距与独立滚动。MenuContent 的 showArrow 可显示指向触发器的箭头，positionerProps 控制方向、对齐与偏移。MenuItem 默认点击关闭；RadioItem、CheckboxItem 默认保持展开，可用 closeOnClick 调整。

内置图标统一使用 24px viewBox、1.5 线宽和圆角端点/连接，默认显示为 16px。Select 箭头随展开状态旋转 180°，收起时恢复，遵循减少动态效果偏好。

## Combobox

基于 [Base UI Combobox](https://base-ui.com/react/components/combobox) 封装，默认 36px，支持 sm 32px / lg 40px，使用 8px 外圆角、4px 菜单项圆角与无边框浮层阴影。输入框放在 ComboboxInputGroup 内，由 Group 统一提供边框、悬停与 accent 焦点环；可组合清空按钮和旋转箭头。

```tsx
import { Combobox, ComboboxInputGroup, ComboboxInput, ComboboxTrigger, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "./components/ui/combobox";

const items = [{ value: "apple", label: "苹果" }, { value: "banana", label: "香蕉" }];

<Combobox items={items}>
  <ComboboxInputGroup>
    <ComboboxInput aria-label="选择水果" placeholder="搜索水果…" />
    <ComboboxTrigger />
  </ComboboxInputGroup>
  <ComboboxContent>
    <ComboboxEmpty>没有匹配的水果</ComboboxEmpty>
    <ComboboxList>{item => <ComboboxItem key={item.value} value={item}>{item.label}</ComboboxItem>}</ComboboxList>
  </ComboboxContent>
</Combobox>
```

浮层内搜索：使用 ComboboxLabel 标记表单入口，ComboboxTrigger 设置 variant="input" 并包含 ComboboxValue；把 ComboboxSearchInput 放入 ComboboxContent 的 header 插槽。搜索框高 36px、自动贴边，带搜索图标、底部分隔线与内收的 2px 焦点高光（距离浮层边缘 1px），与 MenuInput 一致。多选使用 multiple、ComboboxChips、ComboboxChip 和 ComboboxChipRemove；为移除操作提供具体的 aria-label。

使用 createComboboxItems(items, { getValue, getLabel }) 时，渲染函数仍获得完整对象，选中值和表单提交可仅使用 ID。异步搜索设置 filter={null}，自行提供已过滤结果，并合并已选项以保留标签；示例通过清理定时器和 AbortController 取消过期模拟请求，兼容 React 18/19。

可选示例覆盖官网的类型封装、ID 值、多选、浮层内搜索、分组、异步单选与多选、创建选项、虚拟列表；虚拟化用 @tanstack/react-virtual 显示 10,000 项，仅下载示例时需要此依赖。创建操作通过 Modal 确认并去重。示例操作与数据均保留在本地。

ComboboxInputGroup 内容侧内边距为 3px，右侧操作区内边距为 8px；加上 1px 边框后，24/28/32px 标签与 32/36/40px 外框的上、下、左间距均为 4px；标签圆角为 4px，与外框的 8px 圆角同心，默认总高为 36px。输入式触发器使用可伸缩的文字区域，箭头固定在尾部；空值时示例显式渲染占位文字。

DesignSystem 按色彩、文字、间距、按钮、组件顺序展示。组件分组卡片每行一张；输入、选择、开关、复选/单选、Segmented、Slider 和校验提交集中在表单卡片中，Combobox 场景也归入表单分组。Modal 与 Tooltip、Popover、Toast 同组，Drawer 仅保留完整的独立场景示例。

Combobox 箭头按钮不显示悬停背景。箭头在 24px 按钮内居中，带标签、带清空按钮和整框触发器的箭头图形均距离外框右侧 13px；清空按钮出现或隐藏只改变输入区域宽度。清空与标签移除操作仍保留各自的悬停反馈。

危险按钮在两个主题下统一使用实心红底白字：error-700 分别混入 12% / 20% / 28% 黑色作为默认、悬停与按下背景。四个 danger 主题变量只用于当前危险按钮状态，支持在项目主题中覆盖；禁用样式仍优先。

## 统一尺寸 API

| 组件 | sm | md（默认） | lg | 设置位置 |
| --- | --- | --- | --- | --- |
| Button / Input | 32px | 36px | 40px | 直接设置 size |
| Select / Combobox / InputNumber / Segmented | 32px | 36px | 40px | 根组件设置 size，内部继承 |
| Switch | 高 16px、宽 28px | 高 20px、宽 36px | 不提供 | 直接设置 size |

组合组件保留 Base UI 泛型：Select 支持多选值，Combobox 保留 Value/Multiple/Item，Segmented 保留 Value。SelectTrigger、ComboboxInputGroup/Trigger 和 InputNumberGroup 的局部 size 优先。Input 的 size 表示视觉尺寸，不再使用原生数字宽度属性；宽度通过 className 设置。头像保持 rounded-full。

可选示例的表单分组包含统一尺寸对照；中档示例省略 size，以展示默认 36px。其余组件不增加 size；Menu / Combobox 浮层搜索框固定 36px。

## Modal 与 Dialog 的命名

普通弹窗使用 Modal（Base UI Dialog）；需要明确确认的操作使用 Dialog（Base UI AlertDialog）。原有编辑表单从 dialog.tsx 的 Dialog* 导入迁移为 modal.tsx 的 Modal*；新 Dialog 与旧 Dialog 的行为不同。同步更新会覆盖源码，不会自动修改应用中的 import，请手动完成迁移。ModalFooter、DialogFooter 的按钮均默认 md（36px），两类弹窗都使用 24px 圆角和内边距。

Dialog 默认不显示右上角关闭按钮，点击遮罩不会关闭。通过 DialogCancel / DialogAction 组合 Button，或受控 open 处理取消与确认。把取消按钮放在前面，默认焦点会落在第一个可聚焦元素。异步操作时自行等待业务请求成功后关闭，避免提前确认；保留 Base UI 的 Esc 和焦点恢复行为。

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogCancel, DialogAction } from "./components/ui/dialog";

<Dialog>
  <DialogTrigger render={<Button variant="danger" />}>删除记录</DialogTrigger>
  <DialogContent>
    <DialogTitle>确认删除？</DialogTitle>
    <DialogDescription>删除后无法恢复。</DialogDescription>
    <DialogFooter className="mt-6">
      <DialogCancel render={<Button variant="secondary" />}>取消</DialogCancel>
      <DialogAction render={<Button variant="danger" />} onClick={handleDelete}>确认删除</DialogAction>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## InputOTP

基于 Base UI OTPField，默认渲染 6 个输入格，size 为 sm / md / lg（32 / 36 / 40px），默认 md。支持受控 value/onValueChange、onValueComplete、required、disabled、readOnly、name、mask、validationType 和 normalizeValue。数字为默认校验类型，字母数字使用 alphanumeric。name 提交完整验证码，而不是每个格子的值；在 Field 内配合 FieldError 和 Form 使用。

```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./components/ui/input-otp";

<InputOTP size="sm" length={4} aria-label="短信验证码" />;
<InputOTP length={6} name="verification" required aria-label="分组验证码">
  <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} />)}</InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} />)}</InputOTPGroup>
</InputOTP>;
```

自定义分组时，InputOTPSlot 数量必须与 length 相同，size 从 InputOTP 继承。通过 FieldLabel 或 aria-label 提供可访问名称。实际验证码核验应由应用的服务端完成。

## Autocomplete

基于 Base UI Autocomplete，允许输入建议列表之外的内容。根组件 size 默认为 md（36px），支持 sm（32px）、lg（40px），InputGroup/Input 可局部覆盖。Input 可单独使用，也可放在 InputGroup 中组合清空、下拉按钮或图标。InputGroup 统一边框与焦点环；建议浮层为 8px 圆角、4px 列表内间距和 4px 选项圆角。

```tsx
import { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteList, AutocompleteItem, AutocompleteEmpty } from "./components/ui/autocomplete";

<Autocomplete items={["文档", "设计", "开发"]} size="md" name="search">
  <AutocompleteInput aria-label="搜索内容" placeholder="输入关键词" />
  <AutocompleteContent>
    <AutocompleteEmpty>没有匹配建议，可继续输入</AutocompleteEmpty>
    <AutocompleteList>
      {(item: string) => <AutocompleteItem key={item} value={item}>{item}</AutocompleteItem>}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>;
```

根的 value/onValueChange 控制输入字符串；对象和分组数据保留 item 泛型，使用 itemToStringValue 映射文本。模式 list / both / inline / none、异步过滤、键盘导航和表单行为沿用 Base UI。可选示例包含三种尺寸、清空、自由输入提交、对象分组、行内补全与禁用。

## 弹窗嵌套缩进

ModalContent 和 DialogContent 默认支持嵌套缩进：上层弹窗打开时，底层每层缩小 4%、上移 12px，最多缩至 88% 并上移 36px；关闭上层后自动恢复。效果直接使用 Base UI 的 `data-nested-dialog-open` 和 `--nested-dialogs`，不依赖额外状态或动画库。Modal 内可以嵌套 Modal 或确认用的 Dialog；必须在 React 树内嵌套对应 Root，组件自己的 Portal 会处理实际 DOM 位置。

进出与缩进使用平滑的 scale/translate 过渡，开启系统减少动态效果时即时更新。每层 Backdrop 使用 forceRender 保留独立遮罩，固定覆盖视口，位于底层弹窗之上、当前弹窗之下；上层关闭时遮罩一起淡出。保留 Base UI 原有的焦点管理与顶层关闭行为；不会缩放整个页面，也不会改变按钮样式。预览页面浮层分组的“嵌套弹窗”包含两层 Modal 和第三层 Dialog，可观察逐层恢复与输入保留。

## PageStack · 页面切换

`PageStack` 是独立的 React 内容切换容器，没有额外动画依赖，也不管理路由。通过受控的 `value` 切换页面；`PageStackPage` 必须作为直接子元素（支持 Fragment），其 `value` 唯一，按父页到子页的顺序声明。切到后面的页面时，两页一起向左移动；返回前面的页面时一起向右移动，可跨级返回。初次渲染没有入场动画。

```tsx
import { useState } from "react";
import { PageStack, PageStackPage } from "./components/ui/page-stack";
import { Button } from "./components/ui/button";

function Settings() {
  const [page, setPage] = useState("home");
  return (
    <PageStack value={page}>
      <PageStackPage value="home" className="p-6" aria-label="设置">
        <Button onClick={() => setPage("details")}>编辑资料</Button>
      </PageStackPage>
      <PageStackPage value="details" className="p-6" aria-label="资料">
        <Button onClick={() => setPage("home")}>返回</Button>
      </PageStackPage>
    </PageStack>
  );
}
```

默认过渡时间 `duration={300}`（毫秒），通过 CSS translate transition 实现，可中途反向；系统设置减少动态效果时立即切换。容器高度通过 ResizeObserver 跟随当前页面（含动态内容）过渡。圆角、背景和内边距按场景设置，内边距放在 PageStackPage 上；设置容器固定高度时，可在页面内组合 ScrollArea。

所有页面保持挂载，保留输入和组件状态；隐藏页面使用 inert 与 aria-hidden，不能点击、Tab 聚焦或被读屏访问。如果原焦点在离开的页面内，焦点转移到新页面容器；外部导航控件上的焦点保持不变。组件不会改变浏览器历史记录，不自动拦截返回键；接入路由时由应用把路由映射为 value，并保持页面顺序稳定。隐藏页面的 effect 也会继续运行，网络请求等业务行为由应用控制。

## ScrollArea

ScrollArea 默认组合 Root、Viewport、Content、垂直 Scrollbar 和 Thumb。通过 className 设置高度，orientation 可选 vertical（默认）、horizontal 或 both，viewportProps/contentProps 分别配置滚动容器与内容，viewportRef 可读取滚动位置或调用 scrollTo。滚动条轨道宽/高为 10px，内侧 2px 留白形成约 6px 的浅灰滑块，鼠标进入区域时淡入，离开后淡出；键盘聚焦时也会显示。支持原生滚动、拖动和键盘操作，颜色自动适配主题。

```tsx
import { ScrollArea } from "./components/ui/scroll-area";

<ScrollArea className="h-64" viewportProps={{ "aria-label": "消息列表" }} contentProps={{ className: "p-4" }}>
  {messages.map((message) => <p key={message.id}>{message.text}</p>)}
</ScrollArea>;
```

高级布局可使用 ScrollAreaRoot / Viewport / Content / Scrollbar / Thumb / Corner 自行组合；两轴滚动时补上 Corner。

ScrollArea 的 `variant="fade"` 按 Base UI 官方的 Gradient scroll fade 示例，直接在 Viewport 上用溢出距离 CSS 变量驱动遮罩。渐变范围最多 40px，接近起点或终点时逐渐缩小；支持纵向、横向和双向滚动。低层组合可在 ScrollAreaViewport 上设置 `fade` 与 `orientation`。示例见 DesignSystem 的 ScrollArea 卡片。

```tsx
<ScrollArea variant="fade" className="h-64" viewportProps={{ "aria-label": "长内容" }}>
  <article>{content}</article>
</ScrollArea>
```

## Avatar 形状与边框

`shape="circle"` 为默认圆形，`shape="square"` 为 8px 圆角的方形；两种形状均采用 1px `border-control-border` 边框，适配亮暗主题。头像固定为 40 × 40px，边框包含在尺寸内，不提供 size 参数。旧用法中的 size 应移除。回退文字使用 leading-none 与 flex 居中，避免继承正文行高造成视觉偏下。形状仅在根组件设置，图片与回退内容会自动裁切。

```tsx
<Avatar>
  <AvatarImage src={user.image} alt={user.name} />
  <AvatarFallback>林</AvatarFallback>
</Avatar>
<Avatar shape="square">
  <AvatarFallback>林</AvatarFallback>
</Avatar>
```

Menu、Select、Combobox 和 Autocomplete 的可操作菜单项统一显示手形光标；禁用项保留不可操作状态。Modal、Dialog、Drawer、Toast 的关闭图标为 20px，点击区域仍为 32px；输入框清空和标签移除图标保持 16px。

## ContextMenu · 右键菜单

基于 [Base UI Context Menu](https://base-ui.com/react/components/context-menu)。Root 管理受控或非受控的打开状态，Trigger 负责右键与触屏长按，Content 自动组合 Portal、Positioner 和 Popup，跟随指针定位并避让视口边缘。保留 Base UI 的 ref、render、状态 className 和事件回调。子菜单使用 ContextMenuSub / ContextMenuSubTrigger / ContextMenuSubContent。

浮层与 Menu 一致：8px 圆角、4px 内边距、无边框、轻阴影和进出动画；菜单项 4px 圆角、左右 8px 留白，可操作项使用手形光标。ContextMenuItem / LinkItem / Group / GroupLabel / Separator / RadioGroup / RadioItem / CheckboxItem 直接复用现有 Menu 的样式封装，无需额外依赖或主题变量。

```tsx
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
} from "./components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger className="rounded-lg bg-surface-muted p-6">
    在此区域右键或长按
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={copyLink}>复制链接</ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>移动到</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem onClick={archive}>归档</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuItem disabled>暂不可用</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>;
```

右键菜单作为操作补充，同时提供可见按钮或 Menu 入口。DesignSystem 的独立 ContextMenu 卡片包含官方基础、与 Menu 共用操作、嵌套子菜单三个示例，以及保留状态的单选/多选场景；所有场景都提供普通按钮菜单入口。

## 菜单危险项

MenuItem、MenuLinkItem、ContextMenuItem 和 ContextMenuLinkItem 统一支持 `variant="danger"`（默认 `"default"`）。危险项文字使用 `text-error-800`，比原先亮色下的 error-900 更浅；鼠标悬停与键盘高亮使用 `data-highlighted:bg-error-700/10`，在亮暗主题下保持轻量的红色背景。复用现有色板，不新增主题变量；禁用项继续使用四级文字色并禁止交互。

```tsx
<MenuItem variant="danger" onClick={deleteItem}>删除条目</MenuItem>
<ContextMenuItem variant="danger" onClick={deleteItem}>删除条目</ContextMenuItem>
```

## 分隔线与轻量悬停背景

`--divider` 将 `--control-border` 以 60% 强度混入透明色，让分隔线在相同承载表面上比边框更淡。Tailwind 使用 `bg-divider`、`border-divider` 或 `divide-divider`。Menu（含 ContextMenu）、Autocomplete、浮层内搜索框和示例页的内容分隔线使用此色；表单轮廓仍使用 control-border。

`--background-hover` 等量混合 `--background` 与 `--surface-muted`，作为页面轻量悬停底色，亮暗主题下均处于二者之间。使用 `hover:bg-background-hover` 或 `focus-within:bg-background-hover`；两项变量会随根主题基础色变化，也可在项目主题中直接覆盖。

## 会话列表示例

可选的 `list-examples.tsx` 导出 ListExamples，并接入 DesignSystem。会话示例使用 List 子组件组合 40px Avatar、名称与截断描述、独立 Menu 操作按钮；可现场切换分隔线和悬停反馈。选中使用 surface-muted，菜单可打开会话、将其移至顶部或移除，清空后显示空状态。行入口与操作按钮支持键盘，窄屏下文字截断而操作按钮保留。另有小尺寸 Logo 列表，展示无分隔线、无悬停的外观。

## List · 通用列表

`List` 渲染语义化的 `ul`，`ListItem` 渲染 `li`。默认 `divided={true}`、`hoverable={false}`、`size="md"`；`size="sm" | "md" | "lg"` 调整行间距，头像尺寸不变。`ListItem` 可单独设置 divided / hoverable 覆盖根配置。分隔线仅出现在行之间，使用 divider；开启 hoverable 时鼠标悬停和内部键盘聚焦使用 background-hover。没有额外的容器边框或阴影。

```tsx
import {
  List, ListItem, ListItemMedia, ListItemMeta,
  ListItemTitle, ListItemDescription, ListItemActions,
} from "./components/ui/list";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Button } from "./components/ui/button";

<List hoverable aria-label="联系人">
  <ListItem>
    <ListItemMedia>
      <Avatar><AvatarFallback>林</AvatarFallback></Avatar>
    </ListItemMedia>
    <ListItemMeta>
      <ListItemTitle>林晨</ListItemTitle>
      <ListItemDescription>新的消息摘要</ListItemDescription>
    </ListItemMeta>
    <ListItemActions><Button variant="secondary">查看</Button></ListItemActions>
  </ListItem>
</List>;
```

Media 可放头像、图片、Logo 或图标，Actions 可放按钮或 Menu；两侧不压缩，中间 Meta 自适应剩余宽度，标题与描述默认单行截断。`ListItemContent` 是 `ListItemMeta` 的同名功能别名。所有部件转发 ref、原生属性和 className，可用 `whitespace-normal` 等覆盖默认排版。悬停反馈仅控制外观，不自动添加点击行为；需要进入详情时使用真正的 button 或 a，并让右侧操作独立，避免嵌套交互元素。

## Empty · 空状态

用于列表没有数据、首次使用引导或筛选无结果。默认是居中排版、16px 圆角的内容表面，没有容器边框或阴影。图标位于 48px 的中性浅灰背景内，SVG 默认 24px；背景使用 surface-muted，在暗色主题中自动适配，不增加主题变量。

```tsx
import {
  Empty, EmptyHeader, EmptyIcon, EmptyTitle,
  EmptyDescription, EmptyActions, EmptyExtra,
} from "./components/ui/empty";
import { PlusIcon } from "./components/ui/icons";
import { Button } from "./components/ui/button";

function EmptyProjects({ onCreate }: { onCreate: () => void }) {
  return (
    <Empty aria-labelledby="empty-projects-title">
      <EmptyHeader>
        <EmptyIcon><PlusIcon /></EmptyIcon>
        <EmptyTitle id="empty-projects-title">还没有项目</EmptyTitle>
        <EmptyDescription>创建第一个项目，开始整理内容与任务。</EmptyDescription>
      </EmptyHeader>
      <EmptyActions><Button onClick={onCreate}>创建项目</Button></EmptyActions>
      <EmptyExtra>你可以先创建空白项目，之后再邀请成员。</EmptyExtra>
    </Empty>
  );
}
```

所有区域按需组合，可省略标题、图标、操作或 extra。EmptyActions 支持多个按钮与窄屏换行；EmptyExtra 是独立的底部扩展区，默认带浅分隔线，可放帮助说明、模板入口或其它自定义内容。各部件转发 ref、原生属性与 className；图标默认仅装饰，信息通过标题和描述表达。不内置按钮行为、请求或路由，显示时机由业务根据数据决定。嵌入已有卡片时可用 `className="bg-background"` 或 `bg-transparent` 调整背景；放入 List 时使用 ListItem 包裹，保持 ul/li 语义。

可选 DesignSystem 的独立 Empty 卡片提供创建项目、展开模板及筛选无结果示例；List 清空所有会话后也使用 Empty，并可恢复示例数据。
