"use client";

import { useState, type ReactNode } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuCheckboxItem,
} from "../../components/ui/context-menu";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "../../components/ui/menu";

const targetClasses =
  "flex min-h-32 w-full items-center justify-center rounded-lg border border-dashed border-control-border bg-surface-muted p-5 text-center text-secondary select-none outline-accent-700 focus-visible:outline-2";

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
      data-context-menu-example={id}
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
  const [result, setResult] = useState("尚未选择操作");
  function renderActions(context = false) {
    const Item = context ? ContextMenuItem : MenuItem;
    const Separator = context ? ContextMenuSeparator : MenuSeparator;
    return (
      <>
        <Item onClick={() => setResult("已添加到资料库")}>添加到资料库</Item>
        <Item onClick={() => setResult("已添加到播放列表")}>
          添加到播放列表
        </Item>
        <Separator />
        <Item onClick={() => setResult("已设为下一首播放")}>下一首播放</Item>
        <Item disabled>最后播放（不可用）</Item>
        <Separator />
        <Item onClick={() => setResult("已添加收藏")}>添加收藏</Item>
        <Item onClick={() => setResult("已分享")}>分享</Item>
      </>
    );
  }
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className={targetClasses}>
          在此区域右键或长按
        </ContextMenuTrigger>
        <ContextMenuContent>{renderActions(true)}</ContextMenuContent>
      </ContextMenu>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          打开基础操作
        </MenuTrigger>
        <MenuContent>{renderActions()}</MenuContent>
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

const fileActions = ["预览", "下载", "复制链接", "重命名"];
function SharedActions({
  context = false,
  onAction,
}: {
  context?: boolean;
  onAction: (action: string) => void;
}) {
  const Item = context ? ContextMenuItem : MenuItem;
  const Separator = context ? ContextMenuSeparator : MenuSeparator;
  return (
    <>
      {fileActions.map((action) => (
        <Item key={action} onClick={() => onAction(action)}>
          {action}
        </Item>
      ))}
      <Separator />
      <Item variant="danger" onClick={() => onAction("删除")}>
        删除文件
      </Item>
    </>
  );
}

function WithMenu() {
  const [result, setResult] = useState("可右键文件卡片，也可点击操作按钮");
  const onAction = (action: string) => setResult(`已执行：${action}`);
  return (
    <>
      <div className="relative overflow-hidden rounded-lg bg-surface-muted">
        <ContextMenu>
          <ContextMenuTrigger className="select-none">
            <div className="flex h-24 items-center justify-center bg-accent-100 text-accent-900">
              <svg
                aria-hidden="true"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8" cy="8" r="1.5" />
                <path d="m3 17 6-6 4 4 3-3 5 5" />
              </svg>
            </div>
            <div className="space-y-1 p-4 pr-16">
              <p>项目封面.png</p>
              <p className="text-label text-tertiary">PNG · 2.4 MB</p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <SharedActions context onAction={onAction} />
          </ContextMenuContent>
        </ContextMenu>
        <Menu>
          <MenuTrigger
            render={
              <Button
                onlyIcon
                variant="ghost"
                className="absolute right-3 bottom-4"
              />
            }
            aria-label="文件操作"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </MenuTrigger>
          <MenuContent positionerProps={{ align: "end" }}>
            <SharedActions onAction={onAction} />
          </MenuContent>
        </Menu>
      </div>
      <Result>{result}</Result>
    </>
  );
}

function Nested() {
  const [result, setResult] = useState("展开子菜单选择播放列表");
  const actions = (
    <>
      <MenuItem onClick={() => setResult("已添加到资料库")}>
        添加到资料库
      </MenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>添加到播放列表</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          {["晨间音乐", "专注工作", "夜间放松"].map((name) => (
            <ContextMenuItem
              key={name}
              onClick={() => setResult(`已添加到：${name}`)}
            >
              {name}
            </ContextMenuItem>
          ))}
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setResult("已创建播放列表")}>
            新建播放列表
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <MenuSeparator />
      <MenuItem onClick={() => setResult("已设为下一首播放")}>
        下一首播放
      </MenuItem>
    </>
  );
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className={targetClasses}>
          右键展开嵌套菜单
        </ContextMenuTrigger>
        <ContextMenuContent>{actions}</ContextMenuContent>
      </ContextMenu>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          打开播放操作
        </MenuTrigger>
        <MenuContent>{actions}</MenuContent>
      </Menu>
      <Result>{result}</Result>
    </>
  );
}

function Selection() {
  const [sort, setSort] = useState("name");
  const [details, setDetails] = useState(true);
  const actions = (
    <>
      <ContextMenuGroup>
        <ContextMenuGroupLabel>排序方式</ContextMenuGroupLabel>
        <ContextMenuRadioGroup
          value={sort}
          onValueChange={setSort}
          aria-label="文件排序"
        >
          <ContextMenuRadioItem value="name">按名称</ContextMenuRadioItem>
          <ContextMenuRadioItem value="updated">
            按修改时间
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem
        checked={details}
        onCheckedChange={setDetails}
        closeOnClick={false}
      >
        显示详细信息
      </ContextMenuCheckboxItem>
    </>
  );
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className={targetClasses}>
          右键调整视图
        </ContextMenuTrigger>
        <ContextMenuContent>{actions}</ContextMenuContent>
      </ContextMenu>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>
          打开视图设置
        </MenuTrigger>
        <MenuContent>{actions}</MenuContent>
      </Menu>
      <Result>
        {sort === "name" ? "按名称排序" : "按修改时间排序"} · 详细信息
        {details ? "已显示" : "已隐藏"}
      </Result>
    </>
  );
}

export function ContextMenuExamples() {
  return (
    <Card data-demo="context-menu-examples">
      <CardHeader>
        <CardTitle>ContextMenu · 右键菜单</CardTitle>
        <CardDescription>
          支持右键、触屏长按与菜单键盘导航；相同操作也提供可见按钮入口。
          <a
            href="https://base-ui.com/react/components/context-menu#examples"
            target="_blank"
            rel="noreferrer"
            className="ml-1 underline underline-offset-4 hover:text-primary"
          >
            官方示例
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-2">
        <Example
          id="basic"
          title="基础右键菜单"
          description="基础操作、分隔线和禁用项，菜单出现在指针附近。"
        >
          <Basic />
        </Example>
        <Example
          id="with-menu"
          title="与 Menu 共用操作"
          description="文件卡片右键和可见操作按钮使用相同的菜单内容。"
        >
          <WithMenu />
        </Example>
        <Example
          id="nested"
          title="嵌套子菜单"
          description="悬停或使用左右方向键展开和关闭子菜单。"
        >
          <Nested />
        </Example>
        <Example
          id="selection"
          title="单选与多选"
          description="切换排序方式和详细信息显示，复选项选择后保持展开。"
        >
          <Selection />
        </Example>
      </CardContent>
    </Card>
  );
}
