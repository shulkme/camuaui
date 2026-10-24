"use client";

import { useState, type ReactNode } from "react";
import { DrawerExamples } from "./drawer-examples";
import { MenuExamples } from "./menu-examples";
import { ListExamples } from "./list-examples";
import { ContextMenuExamples } from "./context-menu-examples";
import { ComboboxExamples } from "./combobox-examples";
import { ControlSizeExamples } from "./size-examples";
import { FormInputExamples } from "./input-examples";
import { ScrollAreaExamples } from "./scroll-area-examples";
import { PageStackExamples } from "./page-stack-examples";
import { NestedModalExamples } from "./nested-modal-examples";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogCancel, DialogAction } from "../../components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { CheckboxGroup } from "../../components/ui/checkbox-group";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from "../../components/ui/modal";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../components/ui/field";
import { FieldSet, FieldSetLegend } from "../../components/ui/fieldset";
import { Form } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { InputNumber } from "../../components/ui/input-number";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "../../components/ui/progress";
import { Radio } from "../../components/ui/radio";
import { RadioGroup } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { Segmented, SegmentedItem } from "../../components/ui/segmented";
import { Switch } from "../../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "../../components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";

function DemoCard({
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
    <Card data-demo={id}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const filters = [
  { value: "all", label: "全部记录" },
  { value: "unread", label: "未读记录" },
  { value: "assigned", label: "分配给我的记录" },
  { value: "archived", label: "归档记录（不可选）" },
];

const avatarSource = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#e8e8e8"/><circle cx="32" cy="24" r="11" fill="#5a5a5a"/><path d="M12 64v-5a20 20 0 0 1 40 0v5" fill="#5a5a5a"/></svg>')}`;

export function ComponentExamples() {
  const [filter, setFilter] = useState<string | null>("all");
  const [automatic, setAutomatic] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [channels, setChannels] = useState<string[]>(["email"]);
  const [mode, setMode] = useState("assisted");
  const [volume, setVolume] = useState(45);
  const [range, setRange] = useState([20, 80]);
  const [insetVolume, setInsetVolume] = useState(60);
  const [retries, setRetries] = useState<number | null>(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [formResult, setFormResult] = useState("");
  const [segment, setSegment] = useState("all");
  const [segmentResult, setSegmentResult] = useState("");

  return (
    <section aria-labelledby="components-title" className="space-y-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-label text-tertiary">05</span>
        <h2 id="components-title" className="text-title font-semibold">
          组件与交互
        </h2>
      </div>
      <div className="space-y-6" data-component-groups="">
        <section
          aria-label="表单组件"
          data-demo-group="form"
          className="space-y-6"
        >
          <DemoCard
            id="form"
            title="Form · Field · 表单控件"
            description="输入、选择、开关与数值控件统一展示；支持受控状态、禁用、键盘操作和表单校验。"
          >
            <div className="space-y-10">
              <ControlSizeExamples />
              <section aria-labelledby="input-title" className="space-y-4">
                <h4 id="input-title" className="font-medium">
                  Input · Select · InputNumber
                </h4>
                <div className="max-w-xl space-y-4">
                  <Field name="previewName">
                    <FieldLabel>项目名称</FieldLabel>
                    <Input placeholder="例如：示例项目" />
                    <FieldDescription>名称只用于本地预览。</FieldDescription>
                  </Field>
                  <div>
                    <Select
                      items={filters}
                      value={filter}
                      onValueChange={setFilter}
                    >
                      <SelectLabel>记录筛选</SelectLabel>
                      <SelectTrigger>
                        <SelectValue placeholder="选择记录类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {filters.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            disabled={item.value === "archived"}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-2 text-label text-tertiary">
                      当前值：{filter}
                    </p>
                  </div>
                  <Field>
                    <FieldLabel>最大重试次数</FieldLabel>
                    <InputNumber
                      aria-label="最大重试次数"
                      value={retries}
                      onValueChange={setRetries}
                      min={0}
                      max={5}
                      inputProps={{ "aria-label": "最大重试次数" }}
                    />
                    <FieldDescription>
                      范围 0–5，支持方向键与加减按钮。
                    </FieldDescription>
                  </Field>
                  <Input
                    aria-label="不可编辑输入示例"
                    placeholder="不可编辑"
                    disabled
                  />
                </div>
              </section>
              <section aria-labelledby="choices-title" className="space-y-4">
                <h4 id="choices-title" className="font-medium">
                  Switch · Checkbox · Radio
                </h4>
                <div className="max-w-xl space-y-4">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>启用自动更新</span>
                    <Switch
                      checked={automatic}
                      onCheckedChange={setAutomatic}
                    />
                  </label>
                  <p className="text-label text-tertiary">
                    自动更新：{automatic ? "已开启" : "已关闭"}
                  </p>
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span>默认关闭</span>
                    <Switch />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-quaternary">
                    <span>不可用开关</span>
                    <Switch disabled />
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={accepted}
                      onCheckedChange={setAccepted}
                    />
                    我已确认回复内容
                  </label>
                  <label className="flex items-center gap-3 text-quaternary">
                    <Checkbox disabled />
                    不可用选项
                  </label>
                  <FieldSet>
                    <FieldSetLegend>运行模式</FieldSetLegend>
                    <RadioGroup
                      value={mode}
                      onValueChange={setMode}
                      aria-label="运行模式"
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <Radio value="assisted" />
                        手动处理
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <Radio value="automatic" />
                        自动处理
                      </label>
                      <label className="flex items-center gap-3 text-quaternary">
                        <Radio value="offline" disabled />
                        离线模式
                      </label>
                    </RadioGroup>
                    <p className="text-label text-tertiary">当前模式：{mode}</p>
                  </FieldSet>
                </div>
              </section>
              <section
                aria-labelledby="checkbox-group-title"
                className="space-y-4"
              >
                <h4 id="checkbox-group-title" className="font-medium">
                  CheckboxGroup · FieldSet
                </h4>
                <div className="max-w-xl space-y-4">
                  <FieldSet>
                    <FieldSetLegend>接收通知的渠道</FieldSetLegend>
                    <CheckboxGroup
                      value={channels}
                      onValueChange={setChannels}
                      allValues={["email", "telegram", "whatsapp"]}
                      aria-label="通知渠道"
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox parent />
                        全部渠道
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox value="email" />
                        Email
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox value="telegram" />
                        Telegram
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox value="whatsapp" />
                        WhatsApp
                      </label>
                    </CheckboxGroup>
                  </FieldSet>
                  <p className="text-label text-tertiary">
                    已选：{channels.join("、") || "无"}
                  </p>
                </div>
              </section>
              <section aria-labelledby="segmented-title" className="space-y-4">
                <h4 id="segmented-title" className="font-medium">
                  Segmented
                </h4>
                <div className="max-w-xl space-y-4">
                  <Form
                    className="space-y-3"
                    onFormSubmit={(values) =>
                      setSegmentResult(String(values.segmentedFilter))
                    }
                  >
                    <Field name="segmentedFilter">
                      <FieldLabel>记录范围</FieldLabel>
                      <Segmented
                        name="segmentedFilter"
                        value={segment}
                        onValueChange={setSegment}
                        aria-label="记录范围"
                      >
                        <SegmentedItem value="all">全部</SegmentedItem>
                        <SegmentedItem value="unread">未读</SegmentedItem>
                        <SegmentedItem value="mine">我的记录</SegmentedItem>
                        <SegmentedItem value="archived" disabled>
                          归档
                        </SegmentedItem>
                      </Segmented>
                    </Field>
                    <p className="text-label text-tertiary">
                      当前筛选：{segment}
                    </p>
                    <Button type="submit" size="sm" variant="outline">
                      应用分段筛选
                    </Button>
                    {segmentResult && (
                      <p role="status" className="text-label text-success-900">
                        已应用：{segmentResult}
                      </p>
                    )}
                  </Form>
                  <div className="space-y-2">
                    <p className="text-label text-tertiary">
                      统计周期 · 非受控示例
                    </p>
                    <Segmented defaultValue="week" aria-label="统计周期">
                      <SegmentedItem value="day">日</SegmentedItem>
                      <SegmentedItem value="week">周</SegmentedItem>
                      <SegmentedItem value="month">月</SegmentedItem>
                    </Segmented>
                  </div>
                  <Segmented
                    disabled
                    defaultValue="grid"
                    aria-label="不可用布局"
                  >
                    <SegmentedItem value="grid">网格</SegmentedItem>
                    <SegmentedItem value="list">列表</SegmentedItem>
                  </Segmented>
                </div>
              </section>
              <section aria-labelledby="slider-title" className="space-y-4">
                <h4 id="slider-title" className="font-medium">
                  Slider
                </h4>
                <div className="max-w-xl space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between">
                      <span>悬浮滑块 · 消息同步进度</span>
                      <span className="text-tertiary">{volume}%</span>
                    </div>
                    <Slider
                      aria-label="消息同步进度调节"
                      value={volume}
                      onValueChange={setVolume}
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex justify-between">
                      <span>内嵌滑块 · 提示音量</span>
                      <span className="text-tertiary">{insetVolume}%</span>
                    </div>
                    <Slider
                      variant="inset"
                      aria-label="内嵌提示音量"
                      value={insetVolume}
                      onValueChange={setInsetVolume}
                    />
                  </div>
                  <div>
                    <p className="mb-2">时间范围：{range.join("–")}</p>
                    <Slider
                      variant="inset"
                      value={range}
                      onValueChange={setRange}
                      thumbLabels={["开始时间", "结束时间"]}
                    />
                  </div>
                </div>
              </section>
              <section
                aria-labelledby="form-validation-title"
                className="space-y-4"
              >
                <h4 id="form-validation-title" className="font-medium">
                  Form · Field · 校验与提交
                </h4>
                <div className="max-w-xl space-y-4">
                  <Form
                    onFormSubmit={(values) => {
                      setFormResult(`已提交：${String(values.contactEmail)}`);
                    }}
                  >
                    <FieldSet>
                      <FieldSetLegend>联系信息</FieldSetLegend>
                      <Field name="contactEmail">
                        <FieldLabel>联系邮箱</FieldLabel>
                        <Input
                          type="email"
                          required
                          placeholder="name@example.com"
                          autoComplete="email"
                        />
                        <FieldDescription>
                          用于接收需要人工处理的提醒。
                        </FieldDescription>
                        <FieldError match="valueMissing">
                          请输入联系邮箱。
                        </FieldError>
                        <FieldError match="typeMismatch">
                          请输入有效的邮箱地址。
                        </FieldError>
                      </Field>
                      <Field name="contactName">
                        <FieldLabel>联系人</FieldLabel>
                        <Input placeholder="选填" />
                      </Field>
                    </FieldSet>
                    <Button type="submit">提交联系信息</Button>
                    {formResult && (
                      <p role="status" className="text-body text-success-900">
                        {formResult}
                      </p>
                    )}
                  </Form>
                </div>
              </section>
            </div>
          </DemoCard>
          <ComboboxExamples />
          <FormInputExamples />
        </section>
        <ScrollAreaExamples />
        <PageStackExamples />
        <DemoCard
          id="tabs"
          title="Tabs · 两种变体"
          description="胶囊背景和短下划线均会随激活项平滑移动；下划线变体的激活文字加粗。"
        >
          <Tabs defaultValue="overview">
            <TabsList aria-label="胶囊标签页">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="activity">记录</TabsTrigger>
              <TabsTrigger value="tasks" disabled>
                待办
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              切换标签页可查看不同分类的示例内容。
            </TabsContent>
            <TabsContent value="activity">这里展示最近的活动记录。</TabsContent>
          </Tabs>
          <Tabs variant="underline" defaultValue="all">
            <TabsList aria-label="下划线标签页">
              <TabsTrigger value="all">全部消息</TabsTrigger>
              <TabsTrigger value="unread">未读消息</TabsTrigger>
              <TabsTrigger value="done">已处理</TabsTrigger>
            </TabsList>
            <TabsContent value="all">显示全部消息。</TabsContent>
            <TabsContent value="unread">显示尚未阅读的消息。</TabsContent>
            <TabsContent value="done">显示已经处理的消息。</TabsContent>
          </Tabs>
        </DemoCard>
        <DemoCard
          id="progress"
          title="Progress"
          description="展示确定进度与不确定进度，支持进度文字和自定义轨道。"
        >
          <div className="max-w-xl space-y-4">
            <Progress value={volume}>
              <div className="flex justify-between text-label">
                <ProgressLabel>同步状态</ProgressLabel>
                <ProgressValue />
              </div>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <div>
              <p className="mb-2 text-label text-tertiary">正在连接渠道</p>
              <Progress value={null} aria-label="正在连接渠道" />
            </div>
          </div>
        </DemoCard>
        <DemoCard
          id="overlays"
          title="Tooltip · Popover · Modal · Dialog · Toast"
          description="Modal 用于编辑和内容展示，Dialog 用于操作确认；两者均为 24px 圆角与内边距，使用无边框阴影与动画。"
        >
          <div className="flex flex-wrap gap-3">
            <NestedModalExamples />
            <Dialog>
              <DialogTrigger render={<Button variant="danger" />}>
                删除记录
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>确认删除这条记录？</DialogTitle>
                <DialogDescription>此操作不可撤销。示例只展示确认流程，不会删除实际数据。</DialogDescription>
                <DialogFooter className="mt-6">
                  <DialogCancel render={<Button variant="secondary" />}>保留记录</DialogCancel>
                  <DialogAction render={<Button variant="danger" />} onClick={() => toast.add({ title: "已确认删除", description: "本次操作仅用于演示。" })}>确认删除</DialogAction>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Modal open={modalOpen} onOpenChange={setModalOpen}>
              <ModalTrigger render={<Button variant="secondary" />}>
                编辑项目
              </ModalTrigger>
              <ModalContent>
                <ModalTitle>编辑项目</ModalTitle>
                <ModalDescription>
                  设置一个容易识别的项目名称。
                </ModalDescription>
                <Form
                  className="mt-5"
                  onFormSubmit={(values) => {
                    setModalOpen(false);
                    toast.add({
                      title: "项目已更新",
                      description: String(values.workspace),
                    });
                  }}
                >
                  <Field name="workspace">
                    <FieldLabel>项目名称</FieldLabel>
                    <Input required defaultValue="示例项目" />
                    <FieldError match="valueMissing">
                      请输入项目名称。
                    </FieldError>
                  </Field>
                  <ModalFooter>
                    <ModalClose render={<Button variant="secondary" />}>
                      取消修改
                    </ModalClose>
                    <Button type="submit">保存名称</Button>
                  </ModalFooter>
                </Form>
              </ModalContent>
            </Modal>
            <Tooltip>
              <TooltipTrigger render={<Button variant="secondary" />}>
                悬停查看提示
              </TooltipTrigger>
              <TooltipContent>
                悬停或聚焦触发器可以查看提示内容。
              </TooltipContent>
            </Tooltip>
            <Popover>
              <PopoverTrigger render={<Button variant="secondary" />}>
                使用说明
              </PopoverTrigger>
              <PopoverContent>
                <PopoverTitle>功能说明</PopoverTitle>
                <PopoverDescription>
                  点击页面空白处或关闭按钮可收起浮层。
                </PopoverDescription>
                <PopoverClose render={<Button size="sm" />}>
                  知道了
                </PopoverClose>
              </PopoverContent>
            </Popover>
            <Button
              variant="secondary"
              onClick={() =>
                toast.add({
                  title: "设置已保存",
                  description: "当前更改已在本地预览中生效。",
                  actionProps: {
                    children: "撤销",
                    onClick: () => toast.add({ title: "已撤销更改" }),
                  },
                })
              }
            >
              显示通知
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                for (let index = 1; index <= 3; index++) {
                  toast.add({
                    title: `第 ${index} 条通知`,
                    description: "悬停可展开通知，左右滑动可关闭。",
                    timeout: 10000,
                  });
                }
              }}
            >
              堆叠通知
            </Button>
          </div>
        </DemoCard>
        <MenuExamples />
        <ContextMenuExamples />
        <ListExamples />
        <DrawerExamples />
        <Card data-demo="card-avatar">
          <CardHeader>
            <CardTitle>Card · Avatar</CardTitle>
            <CardDescription>
              卡片使用 16px
              圆角，可选择内容表面或页面背景；头像统一为 40px，支持圆形与 8px 圆角方形，均带细边框。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 rounded-lg bg-surface-muted p-4 sm:grid-cols-2">
              <Card variant="surface" data-demo="card-surface">
                <CardTitle>内容表面</CardTitle>
                <CardDescription className="mt-1">
                  默认 variant="surface"，使用 bg-surface。
                </CardDescription>
              </Card>
              <Card variant="background" data-demo="card-background">
                <CardTitle>页面背景</CardTitle>
                <CardDescription className="mt-1">
                  variant="background"，使用 bg-background。
                </CardDescription>
              </Card>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar>
                <AvatarImage src={avatarSource} alt="示例用户头像" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>林</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="data:image/png;base64,AA=="
                  alt="不可用的头像"
                />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar shape="square" aria-label="方形图片头像">
                <AvatarImage src={avatarSource} alt="方形用户头像" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar shape="square" aria-label="方形文字头像">
                <AvatarFallback>林</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">示例用户</p>
                <p className="text-label text-tertiary">user@example.com</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="secondary"
              onClick={() =>
                toast.add({
                  title: "用户信息",
                  description: "用户资料组件预览。",
                })
              }
            >
              查看资料
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
