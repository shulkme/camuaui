"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
  DrawerSwipeArea,
  DrawerTitle,
  DrawerTrigger,
  DrawerVirtualKeyboardProvider,
  createDrawerHandle,
  type DrawerSide,
  type DrawerSnapPoint,
} from "../../components/ui/drawer";
import { Field, FieldLabel } from "../../components/ui/field";
import { Form } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { controlClasses } from "../../components/ui/styles";
import { cn } from "../../lib/utils";

function Example({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      data-drawer-example={id}
      className="min-w-0 space-y-4 rounded-lg bg-background p-5"
    >
      <div className="space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-label text-tertiary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function CloseButton({ children = "完成" }: { children?: ReactNode }) {
  return (
    <DrawerFooter className="mt-6 justify-start">
      <DrawerClose render={<Button />}>{children}</DrawerClose>
    </DrawerFooter>
  );
}

function Positions() {
  const positions: [DrawerSide, string, string][] = [
    ["top", "上方", "向上"],
    ["right", "右侧", "向右"],
    ["bottom", "下方", "向下"],
    ["left", "左侧", "向左"],
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {positions.map(([side, label, direction]) => (
        <Drawer key={side} side={side}>
          <DrawerTrigger render={<Button variant="secondary" size="sm" />}>
            {label}抽屉
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>{label}抽屉</DrawerTitle>
            <DrawerDescription>
              从{label}进入，可拖动靠近页面的把手{direction}关闭，也可以按 Esc
              返回。
            </DrawerDescription>
            <div className="mt-6 space-y-4">
              <Field>
                <FieldLabel>抽屉名称</FieldLabel>
                <Input defaultValue={`${label}工作面板`} />
              </Field>
              <label className="flex items-center justify-between gap-4">
                接收记录提醒
                <Switch defaultChecked />
              </label>
            </div>
            <CloseButton />
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-3">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="secondary" />}>
          打开受控抽屉
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>受控抽屉</DrawerTitle>
          <DrawerDescription>抽屉的打开状态与页面反馈同步。</DrawerDescription>
          <CloseButton>关闭受控抽屉</CloseButton>
        </DrawerContent>
      </Drawer>
      <p role="status" className="text-label text-tertiary">
        当前状态：{open ? "已打开" : "已关闭"}；四方位示例使用非受控状态。
      </p>
    </div>
  );
}

function StackLevel({ level = 0 }: { level?: number }) {
  const titles = ["通知中心", "渠道通知", "高级通知"];
  const rows = [3, 2, 5];
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="secondary" />}>
        {level === 0 ? "打开堆叠抽屉" : `打开${titles[level]}`}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>{titles[level]}</DrawerTitle>
        <DrawerDescription>
          第 {level + 1} 层 ·{" "}
          {level === 2
            ? "关闭后返回渠道通知，之前的设置仍会保留。"
            : "继续打开下一层，观察不同高度的抽屉如何堆叠。"}
        </DrawerDescription>
        <div className="my-6 space-y-4">
          {Array.from({ length: rows[level] }, (_, i) => (
            <label key={i} className="flex items-center justify-between gap-4">
              {
                [
                  "即时提醒",
                  "提及我的消息",
                  "新分配记录",
                  "声音提醒",
                  "桌面通知",
                ][i]
              }
              <Switch defaultChecked={i === 0} />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {level < 2 && <StackLevel level={level + 1} />}
          <DrawerClose render={<Button />}>
            {level === 0 ? "关闭通知中心" : "返回上一层"}
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SnapPoints() {
  const [point, setPoint] = useState<DrawerSnapPoint | null>(0.35);
  const [sequential, setSequential] = useState(false);
  return (
    <Drawer
      snapPoints={[0.35, 0.65, 1]}
      snapPoint={point}
      onSnapPointChange={setPoint}
      snapToSequentialPoints={sequential}
    >
      <DrawerTrigger render={<Button variant="secondary" />}>
        打开多段停靠抽屉
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>多段停靠</DrawerTitle>
        <DrawerDescription>
          拖动把手或选择高度；快速拖动时默认允许跨过停靠点。
        </DrawerDescription>
        <div className="my-5 flex gap-2">
          {[0.35, 0.65, 1].map((value) => (
            <Button
              key={value}
              size="sm"
              variant={point === value ? "primary" : "secondary"}
              aria-pressed={point === value}
              onClick={() => setPoint(value)}
            >
              {Math.round(value * 100)}%
            </Button>
          ))}
        </div>
        <label className="flex items-center justify-between gap-4">
          按距离依次停靠
          <Switch checked={sequential} onCheckedChange={setSequential} />
        </label>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="rounded-lg bg-surface-muted p-4">
              <p>记录提醒 {i + 1}</p>
              <p className="mt-1 text-label text-tertiary">
                内容可滚动，拖动把手可调整面板高度。
              </p>
            </div>
          ))}
        </div>
        <CloseButton />
      </DrawerContent>
    </Drawer>
  );
}

function KeyboardAware() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  const [note, setNote] = useState("");
  const formId = useId();
  const fields = [
    ["name", "收件人", "林晓"],
    ["phone", "联系电话", "138 0000 0000"],
    ["province", "省份", "浙江省"],
    ["city", "城市", "杭州市"],
    ["street", "街道", "文一西路"],
    ["building", "楼栋", "A 座"],
    ["room", "门牌号", "1201"],
    ["time", "送达时间", "工作日 18:00 后"],
  ];
  return (
    <div className="space-y-3">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="secondary" />}>
          打开键盘适配抽屉
        </DrawerTrigger>
        <DrawerVirtualKeyboardProvider>
          <DrawerContent
            className="h-[85dvh]"
            initialFocus={false}
            header={
              <div className="shrink-0 px-6 pb-3">
                <DrawerTitle>配送信息</DrawerTitle>
                <DrawerDescription>
                  在手机上点按下方输入项，面板会随软键盘保持当前字段可见。
                </DrawerDescription>
              </div>
            }
            footer={
              <div className="shrink-0 space-y-3 px-6 pt-3 pb-[calc(1.5rem+var(--drawer-keyboard-inset,0px))]">
                <label className="block space-y-2">
                  <span className="text-label text-secondary">快捷备注</span>
                  <Input
                    form={formId}
                    name="note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="例如：请放在前台"
                  />
                </label>
                <Button type="submit" form={formId} className="w-full">
                  保存配送信息
                </Button>
              </div>
            }
          >
            <Form
              id={formId}
              onFormSubmit={(values) => {
                setResult(
                  `已保存${String(values.name || "收件人")}的配送信息${note ? `，备注：${note}` : ""}`,
                );
                setOpen(false);
              }}
            >
              {fields.map(([name, label, placeholder]) => (
                <Field key={name} name={name}>
                  <FieldLabel>{label}</FieldLabel>
                  <Input
                    placeholder={placeholder}
                    inputMode={name === "phone" ? "tel" : "text"}
                  />
                </Field>
              ))}
            </Form>
          </DrawerContent>
        </DrawerVirtualKeyboardProvider>
      </Drawer>
      {result && (
        <p role="status" className="text-label text-secondary">
          {result}
        </p>
      )}
    </div>
  );
}

function Indent() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <DrawerProvider>
      <div
        ref={setContainer}
        className="relative isolate h-80 overflow-hidden rounded-lg"
      >
        <DrawerIndentBackground />
        <DrawerIndent className="flex h-full flex-col items-center justify-center gap-4 p-5 text-center">
          <p className="font-medium">内容预览</p>
          <p className="text-label text-tertiary">
            打开抽屉时，后方内容会轻微缩小并露出底层背景。
          </p>
          <Drawer modal={false}>
            <DrawerTrigger render={<Button variant="secondary" />}>
              体验页面缩进
            </DrawerTrigger>
            <DrawerContent
              className="max-h-full"
              portalProps={{ container }}
              viewportProps={{ className: "absolute" }}
              backdropProps={{ className: "absolute min-h-0" }}
              showBackdrop
            >
              <DrawerTitle>内容概览</DrawerTitle>
              <DrawerDescription>
                拖动抽屉时，后方页面会跟随手势恢复。
              </DrawerDescription>
              <CloseButton>返回预览</CloseButton>
            </DrawerContent>
          </Drawer>
        </DrawerIndent>
      </div>
    </DrawerProvider>
  );
}

function NonModal() {
  const [count, setCount] = useState(0);
  return (
    <div className="space-y-3">
      <Drawer side="right" modal={false} disablePointerDismissal>
        <DrawerTrigger render={<Button variant="secondary" />}>
          打开非模态抽屉
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>辅助工作面板</DrawerTitle>
          <DrawerDescription>
            页面仍可操作，点击外部不会关闭此面板。
          </DrawerDescription>
          <p className="mt-6 text-secondary">页面计数：{count}</p>
          <CloseButton>关闭辅助面板</CloseButton>
        </DrawerContent>
      </Drawer>
      <div>
        <Button variant="outline" size="sm" onClick={() => setCount(count + 1)}>
          页面计数 +1
        </Button>
        <p role="status" className="mt-2 text-label text-tertiary">
          页面计数：{count}
        </p>
      </div>
    </div>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer side="top" open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="secondary" />}>
        打开移动导航
      </DrawerTrigger>
      <DrawerContent
        className="h-full max-h-full max-w-none"
        showHandle={false}
      >
        <DrawerTitle>浏览视觉规范</DrawerTitle>
        <DrawerDescription>
          选择一个章节，或向上滑动关闭导航。
        </DrawerDescription>
        <nav aria-label="设计规范章节" className="mt-8 space-y-3">
          {[
            ["colors-title", "语义色彩"],
            ["buttons-title", "按钮与反馈"],
            ["typography-title", "文字层级"],
            ["geometry-title", "间距与形状"],
            ["components-title", "组件与交互"],
          ].map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center gap-4 rounded-lg px-4 text-title hover:bg-surface-muted"
            >
              <span className="font-mono text-label text-tertiary">
                0{i + 1}
              </span>
              {label}
            </a>
          ))}
        </nav>
        <CloseButton>收起导航</CloseButton>
      </DrawerContent>
    </Drawer>
  );
}

function SwipeToOpen() {
  return (
    <Drawer side="right">
      <div className="relative flex h-36 items-center rounded-lg bg-surface p-5 pr-20">
        <DrawerTrigger render={<Button variant="secondary" size="sm" />}>
          打开边缘抽屉
        </DrawerTrigger>
        <DrawerSwipeArea
          aria-label="向左拖动打开抽屉"
          className="absolute inset-y-0 right-0 flex w-16 touch-none cursor-grab items-center justify-center rounded-r-lg bg-surface-muted px-3 text-center text-label text-secondary active:cursor-grabbing"
        >
          向左拖动
        </DrawerSwipeArea>
      </div>
      <DrawerContent>
        <DrawerTitle>边缘滑出</DrawerTitle>
        <DrawerDescription>
          从示例区域右边缘向左拖动即可打开，向右拖动把手可关闭。
        </DrawerDescription>
        <CloseButton />
      </DrawerContent>
    </Drawer>
  );
}

function CloseConfirmation() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState("");
  return (
    <div className="space-y-3">
      <Drawer
        side="right"
        open={open}
        onOpenChange={(next, details) => {
          if (!next && draft.trim()) {
            details.cancel();
            setConfirm(true);
            return;
          }
          setOpen(next);
        }}
      >
        <DrawerTrigger render={<Button variant="secondary" />}>
          编写消息草稿
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>消息草稿</DrawerTitle>
          <DrawerDescription>
            输入内容后尝试关闭，未保存的草稿会先询问是否放弃。
          </DrawerDescription>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setResult("草稿已保存");
              setDraft("");
              setOpen(false);
            }}
          >
            <label className="block space-y-2">
              <span>消息内容</span>
              <textarea
                required
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="输入想发送给客户的消息"
                className={cn(controlClasses, "min-h-40 resize-y py-3")}
              />
            </label>
            <DrawerFooter className="justify-start">
              <DrawerClose render={<Button variant="secondary" />}>
                取消编辑
              </DrawerClose>
              <Button type="submit">保存草稿</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
        <Dialog open={confirm} onOpenChange={setConfirm}>
          <DialogContent>
            <DialogTitle>放弃未保存的草稿？</DialogTitle>
            <DialogDescription>关闭后将清空本次输入的内容。</DialogDescription>
            <DialogFooter className="mt-6">
              <DialogClose render={<Button variant="secondary" />}>
                继续编辑
              </DialogClose>
              <Button
                variant="danger"
                onClick={() => {
                  setDraft("");
                  setConfirm(false);
                  setOpen(false);
                  setResult("已放弃草稿");
                }}
              >
                放弃草稿
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Drawer>
      {result && (
        <p role="status" className="text-label text-tertiary">
          {result}
        </p>
      )}
    </div>
  );
}

function ActionSheet() {
  const [result, setResult] = useState("");
  return (
    <div className="space-y-3">
      <Drawer>
        <DrawerTrigger render={<Button variant="secondary" />}>
          打开操作面板
        </DrawerTrigger>
        <DrawerContent
          className="gap-3 bg-transparent shadow-none"
          showHandle={false}
          showCloseButton={false}
          contentProps={{
            className:
              "flex-none rounded-3xl bg-surface-raised p-6 shadow-popup",
          }}
          footer={
            <DrawerClose
              render={
                <Button
                  variant="danger"
                  className="w-full rounded-3xl shadow-popup"
                  onClick={() => setResult("已在示例中移除此记录")}
                />
              }
            >
              移除此记录
            </DrawerClose>
          }
        >
          <DrawerTitle>记录操作</DrawerTitle>
          <DrawerDescription>常规操作与移除操作分开放置。</DrawerDescription>
          <div className="mt-4 flex flex-col gap-1">
            {["标记已读", "置顶记录", "添加到收藏"].map((action) => (
              <DrawerClose
                key={action}
                render={
                  <Button
                    variant="ghost"
                    className="justify-start rounded-lg"
                    onClick={() =>
                      setResult(
                        action === "标记已读"
                          ? "已标记为已读"
                          : action === "置顶记录"
                            ? "记录已置顶"
                            : "已添加到收藏",
                      )
                    }
                  />
                }
              >
                {action}
              </DrawerClose>
            ))}
          </div>
          <DrawerFooter className="mt-4">
            <DrawerClose
              render={<Button variant="secondary" className="w-full" />}
            >
              取消操作
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {result && (
        <p role="status" className="text-label text-tertiary">
          {result}
        </p>
      )}
    </div>
  );
}

function DetachedTriggers() {
  const [handle] = useState(() =>
    createDrawerHandle<{ title: string; channel: string }>(),
  );
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {[
          ["邮件渠道", "Email"],
          ["在线记录", "Web Chat"],
        ].map(([title, channel]) => (
          <DrawerTrigger
            key={channel}
            handle={handle}
            payload={{ title, channel }}
            render={<Button variant="secondary" size="sm" />}
          >
            {title}设置
          </DrawerTrigger>
        ))}
      </div>
      <Drawer handle={handle} side="right">
        {({ payload }) => (
          <DrawerContent>
            <DrawerTitle>{payload?.title ?? "渠道"}设置</DrawerTitle>
            <DrawerDescription>
              多个入口共用一个抽屉，内容来自当前入口。
            </DrawerDescription>
            <p className="mt-6 text-secondary">当前渠道：{payload?.channel}</p>
            <Field className="mt-5">
              <FieldLabel>显示名称</FieldLabel>
              <Input key={payload?.channel} defaultValue={payload?.title} />
            </Field>
            <CloseButton>完成渠道设置</CloseButton>
          </DrawerContent>
        )}
      </Drawer>
    </>
  );
}

export function DrawerExamples() {
  return (
    <Card data-demo="drawer-examples">
      <CardHeader>
        <CardTitle>Drawer · 场景示例</CardTitle>
        <CardDescription>
          覆盖官方示例中的交互场景，统一使用项目主题与抽屉样式。
        </CardDescription>
        <a
          href="https://base-ui.com/react/components/drawer#examples"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-label text-secondary underline underline-offset-4"
        >
          查看 Base UI 官方示例
        </a>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-2">
        <Example
          id="positions"
          title="四个方位"
          description="上、右、下、左独立定位，滑动关闭方向与所在边缘一致。"
        >
          <Positions />
        </Example>
        <Example
          id="state"
          title="受控与非受控"
          description="用页面状态控制打开与关闭，其余简单示例由抽屉管理状态。"
        >
          <Controlled />
        </Example>
        <Example
          id="nested"
          title="嵌套、堆叠与动画"
          description="三层不同高度的抽屉，后方缩小并露出边缘，关闭时逐层返回。"
        >
          <StackLevel />
        </Example>
        <Example
          id="snap"
          title="多段停靠"
          description="35%、65%、全屏三段高度，支持拖动与按距离停靠。"
        >
          <SnapPoints />
        </Example>
        <Example
          id="keyboard"
          title="软键盘适配"
          description="可滚动的长表单与固定页头页脚，输入时保持字段可见。"
        >
          <KeyboardAware />
        </Example>
        <Example
          id="non-modal"
          title="非模态面板"
          description="不锁定页面焦点，也不拦截页面操作；可在外部继续计数。"
        >
          <NonModal />
        </Example>
        <Example
          id="indent"
          title="页面缩进"
          description="在局部内容区域中演示内容缩小、圆角变化与手势联动。"
        >
          <Indent />
        </Example>
        <Example
          id="mobile-navigation"
          title="移动导航"
          description="从顶部展开的整屏章节导航，选择后关闭并跳转到相应章节。"
        >
          <MobileNavigation />
        </Example>
        <Example
          id="swipe-area"
          title="从边缘滑出"
          description="拖动右侧区域打开抽屉，同时提供按钮与键盘入口。"
        >
          <SwipeToOpen />
        </Example>
        <Example
          id="confirmation"
          title="关闭前确认"
          description="有未保存内容时，点击关闭、遮罩、按 Esc 或滑动都会先确认。"
        >
          <CloseConfirmation />
        </Example>
        <Example
          id="action-sheet"
          title="操作面板"
          description="把常规记录操作与移除操作放在两个独立表面中。"
        >
          <ActionSheet />
        </Example>
        <Example
          id="detached"
          title="分离触发器与内容传递"
          description="两个独立入口共用一个抽屉，展示各自的渠道设置。"
        >
          <DetachedTriggers />
        </Example>
      </CardContent>
    </Card>
  );
}
