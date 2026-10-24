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
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from "../../components/ui/modal";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { ChevronDownIcon } from "../../components/ui/icons";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuFilterProvider,
  MenuInput,
  MenuClear,
  MenuEmpty,
  createMenuHandle,
} from "../../components/ui/menu";

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
      data-menu-example={id}
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

function Result({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="text-label text-secondary">
      {children}
    </p>
  );
}

function Basic() {
  const [result, setResult] = useState("选择一项操作。");
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          基础菜单
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setResult("已新建副本")}>新建副本</MenuItem>
          <MenuItem onClick={() => setResult("已复制链接")}>复制链接</MenuItem>
          <MenuSeparator />
          <MenuItem disabled>导出文件（不可用）</MenuItem>
          <MenuSeparator />
          <MenuItem variant="danger" onClick={() => setResult("已删除示例条目")}>
            删除条目
          </MenuItem>
        </MenuContent>
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

function Groups() {
  const [result, setResult] = useState("编辑与整理操作按组展示。");
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          分组菜单
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>编辑</MenuGroupLabel>
            <MenuItem onClick={() => setResult("已执行剪切")}>剪切</MenuItem>
            <MenuItem onClick={() => setResult("已执行复制")}>复制</MenuItem>
            <MenuItem disabled>粘贴（不可用）</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>整理</MenuGroupLabel>
            <MenuItem onClick={() => setResult("已移入归档")}>
              移入归档
            </MenuItem>
            <MenuItem onClick={() => setResult("已添加收藏")}>
              添加收藏
            </MenuItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

function Submenus() {
  const [result, setResult] = useState("悬停或按方向键展开子菜单。");
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          多级菜单
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setResult("已打开条目")}>打开条目</MenuItem>
          <MenuSub>
            <MenuSubTrigger>移动到</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem onClick={() => setResult("已移动到收件箱")}>
                收件箱
              </MenuItem>
              <MenuItem onClick={() => setResult("已移动到归档目录")}>
                归档目录
              </MenuItem>
              <MenuSub>
                <MenuSubTrigger>更多目录</MenuSubTrigger>
                <MenuSubContent>
                  <MenuItem onClick={() => setResult("已移动到文档目录")}>
                    文档目录
                  </MenuItem>
                  <MenuItem onClick={() => setResult("已移动到图片目录")}>
                    图片目录
                  </MenuItem>
                </MenuSubContent>
              </MenuSub>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem disabled>共享到（不可用）</MenuItem>
        </MenuContent>
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

const sorting = [
  { value: "updated", label: "最近修改" },
  { value: "name", label: "名称顺序" },
  { value: "size", label: "文件大小" },
];

function SingleChoice() {
  const [value, setValue] = useState("updated");
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          排序方式
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuRadioGroup
            value={value}
            onValueChange={setValue}
            aria-label="排序方式"
          >
            <MenuGroupLabel>排序依据</MenuGroupLabel>
            {sorting.map((item) => (
              <MenuRadioItem key={item.value} value={item.value}>
                {item.label}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
      <Result>
        当前排序：{sorting.find((item) => item.value === value)?.label}
      </Result>
    </>
  );
}

const columns = [
  { value: "name", label: "名称列" },
  { value: "updated", label: "修改日期列" },
  { value: "status", label: "状态列" },
];

function MultipleChoice() {
  const [selected, setSelected] = useState(["name", "updated"]);
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          显示列
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>可同时选择多项</MenuGroupLabel>
            {columns.map((item) => (
              <MenuCheckboxItem
                key={item.value}
                checked={selected.includes(item.value)}
                closeOnClick={false}
                onCheckedChange={(checked) =>
                  setSelected((previous) =>
                    checked
                      ? [...previous, item.value]
                      : previous.filter((value) => value !== item.value),
                  )
                }
              >
                {item.label}
              </MenuCheckboxItem>
            ))}
            <MenuCheckboxItem disabled>所有者列（不可用）</MenuCheckboxItem>
          </MenuGroup>
        </MenuContent>
      </Menu>
      <Result>
        已显示：
        {columns
          .filter((item) => selected.includes(item.value))
          .map((item) => item.label)
          .join("、") || "无"}
      </Result>
    </>
  );
}

function ClosingBehavior() {
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          关闭行为
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuItem
            closeOnClick={false}
            onClick={() => setCount((value) => value + 1)}
          >
            计数 +1（保持展开）
          </MenuItem>
          <MenuCheckboxItem
            checked={enabled}
            onCheckedChange={setEnabled}
            closeOnClick
          >
            完成后自动关闭
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuItem>完成并关闭</MenuItem>
        </MenuContent>
      </Menu>
      <Result>
        计数：{count}；选项：{enabled ? "已开启" : "已关闭"}
      </Result>
    </>
  );
}

function HoverMenu() {
  const [result, setResult] = useState("悬停 200ms 后打开，也支持点击与键盘。");
  return (
    <>
      <Menu>
        <MenuTrigger
          openOnHover
          delay={200}
          closeDelay={150}
          render={<Button variant="secondary" />}
        >
          悬停打开
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setResult("已收藏此项")}>收藏此项</MenuItem>
          <MenuItem onClick={() => setResult("已标记为稍后处理")}>
            稍后处理
          </MenuItem>
        </MenuContent>
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

function NavigationAndModal() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(
    "链接跳转到本页色板；编辑项会打开对话框。",
  );
  return (
    <>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          导航与弹窗
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent>
          <MenuLinkItem href="#colors-title" closeOnClick>
            跳转到色板
          </MenuLinkItem>
          <MenuItem onClick={() => setOpen(true)}>编辑条目</MenuItem>
        </MenuContent>
      </Menu>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalTitle>编辑条目</ModalTitle>
          <ModalDescription>
            菜单操作也可以打开一个独立的对话框。
          </ModalDescription>
          <Field className="mt-5">
            <FieldLabel>条目名称</FieldLabel>
            <Input defaultValue="示例条目" />
          </Field>
          <ModalFooter className="mt-6">
            <ModalClose render={<Button variant="secondary" />}>
              取消编辑
            </ModalClose>
            <ModalClose
              render={<Button onClick={() => setResult("条目已保存")} />}
            >
              保存条目
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Result>{result}</Result>
    </>
  );
}

function DetachedTriggers() {
  const [handle] = useState(() => createMenuHandle<{ label: string }>());
  const [result, setResult] = useState(
    "多个分离入口共享菜单，并传入各自的条目。",
  );
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {["文档 A", "文档 B"].map((label) => (
          <MenuTrigger
            key={label}
            handle={handle}
            payload={{ label }}
            render={<Button variant="secondary" />}
          >
            {label} 操作
            <ChevronDownIcon />
          </MenuTrigger>
        ))}
      </div>
      <Menu handle={handle}>
        {({ payload }) => (
          <MenuContent>
            <MenuGroup>
              <MenuGroupLabel>{payload?.label ?? "文档"}</MenuGroupLabel>
              <MenuItem
                onClick={() => setResult(`已打开${payload?.label ?? "文档"}`)}
              >
                打开所选文档
              </MenuItem>
              <MenuItem
                onClick={() => setResult(`已复制${payload?.label ?? "文档"}`)}
              >
                复制所选文档
              </MenuItem>
            </MenuGroup>
          </MenuContent>
        )}
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

function ControlledTriggers() {
  const [open, setOpen] = useState(false);
  const [triggerId, setTriggerId] = useState<string | null>(null);
  const leftId = useId();
  const rightId = useId();
  const [result, setResult] = useState("选择一个入口查看当前锚点。");
  return (
    <>
      <Menu
        open={open}
        triggerId={triggerId}
        modal={false}
        onOpenChange={(next, details) => {
          setOpen(next);
          if (next) setTriggerId(details.trigger?.id ?? null);
        }}
      >
        <div className="flex flex-wrap gap-2">
          <MenuTrigger id={leftId} render={<Button variant="secondary" />}>
            左侧入口
          </MenuTrigger>
          <MenuTrigger id={rightId} render={<Button variant="secondary" />}>
            右侧入口
          </MenuTrigger>
        </div>
        <MenuContent>
          <MenuItem
            onClick={() =>
              setResult(`已从${triggerId === leftId ? "左侧" : "右侧"}入口执行`)
            }
          >
            执行所选操作
          </MenuItem>
        </MenuContent>
      </Menu>
      <Result>
        菜单：{open ? "已展开" : "已关闭"}；{result}
      </Result>
    </>
  );
}

function ArrowAndAnimation() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("观察箭头、缩放和淡入淡出动画。");
  return (
    <>
      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger render={<Button variant="secondary" />}>
          箭头与动画
          <ChevronDownIcon />
        </MenuTrigger>
        <MenuContent
          showArrow
          positionerProps={{ side: "top", align: "center", sideOffset: 10 }}
        >
          <MenuItem onClick={() => setResult("已选择预览操作")}>
            预览操作
          </MenuItem>
          <MenuItem onClick={() => setResult("已选择下载操作")}>
            下载操作
          </MenuItem>
        </MenuContent>
      </Menu>
      <Result>{open ? "菜单已展开" : result}</Result>
    </>
  );
}

function Searchable() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(
    "输入关键词过滤，支持方向键和 Enter 选择。",
  );
  const actions = [
    "新建文件",
    "新建文件夹",
    "复制地址",
    "导出 PDF",
    "打开设置",
  ];
  return (
    <>
      <MenuFilterProvider value={query} onValueChange={setQuery} autoHighlight>
        <Menu>
          <MenuTrigger render={<Button variant="secondary" />}>
            搜索菜单
            <ChevronDownIcon />
          </MenuTrigger>
          <MenuContent
            header={
              <div className="relative">
                <MenuInput
                  aria-label="搜索菜单操作"
                  placeholder="搜索操作…"
                  className="pr-8"
                />
                {query && (
                  <MenuClear className="absolute top-1/2 right-1 -translate-y-1/2" />
                )}
              </div>
            }
          >
            <MenuEmpty>没有匹配的操作</MenuEmpty>
            {actions.map((action) => (
              <MenuItem
                key={action}
                label={action}
                onClick={() => setResult(`已执行：${action}`)}
              >
                {action}
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>
      </MenuFilterProvider>
      <Result>{result}</Result>
    </>
  );
}

export function MenuExamples() {
  return (
    <Card data-demo="menu-examples">
      <CardHeader>
        <CardTitle>Menu · 场景示例</CardTitle>
        <CardDescription>
          分组、多级子菜单、单选、多选和交互组合；浮层圆角 8px、内边距
          4px，菜单项圆角 4px、左右内边距 8px。
          <a
            href="https://base-ui.com/react/components/menu#examples"
            target="_blank"
            rel="noreferrer"
            className="ml-1 underline underline-offset-4 hover:text-primary"
          >
            官方用法
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Example
          id="basic"
          title="基础操作与禁用"
          description="普通菜单项执行操作，禁用项保留位置但不可交互。"
        >
          <Basic />
        </Example>
        <Example
          id="groups"
          title="分组与分隔线"
          description="用带标签的分组和分隔线组织不同类型的操作。"
        >
          <Groups />
        </Example>
        <Example
          id="submenus"
          title="多级子菜单"
          description="支持多层嵌套、悬停展开及左右方向键导航。"
        >
          <Submenus />
        </Example>
        <Example
          id="radio"
          title="单选菜单"
          description="RadioGroup 管理互斥选项，状态保留并显示勾选。"
        >
          <SingleChoice />
        </Example>
        <Example
          id="checkbox"
          title="多选菜单"
          description="CheckboxItem 独立切换，选择后保持菜单展开。"
        >
          <MultipleChoice />
        </Example>
        <Example
          id="closing"
          title="点击后的关闭行为"
          description="普通项可保持展开，复选项也可以设置选择后关闭。"
        >
          <ClosingBehavior />
        </Example>
        <Example
          id="hover"
          title="悬停打开"
          description="使用 openOnHover、delay 和 closeDelay 控制悬停行为。"
        >
          <HoverMenu />
        </Example>
        <Example
          id="navigation"
          title="链接与打开弹窗"
          description="使用真正的链接导航，或从菜单项打开对话框。"
        >
          <NavigationAndModal />
        </Example>
        <Example
          id="detached"
          title="分离入口与内容传递"
          description="通过 handle 关联菜单，多个入口传入各自的 payload。"
        >
          <DetachedTriggers />
        </Example>
        <Example
          id="controlled"
          title="受控的多触发器"
          description="使用 open、onOpenChange 和 triggerId 控制状态与锚点。"
        >
          <ControlledTriggers />
        </Example>
        <Example
          id="animation"
          title="箭头与动画"
          description="可选箭头跟随锚点，复用浮层进出动画与减少动态效果偏好。"
        >
          <ArrowAndAnimation />
        </Example>
        <Example
          id="filtering"
          title="搜索过滤"
          description="内置过滤、自动高亮、清空输入和无结果提示。"
        >
          <Searchable />
        </Example>
      </CardContent>
    </Card>
  );
}
