"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Empty, EmptyHeader, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from "../../components/ui/empty";
import { PlusIcon } from "../../components/ui/icons";
import { List, ListItem, ListItemMedia, ListItemMeta, ListItemTitle, ListItemDescription, ListItemActions } from "../../components/ui/list";
import { Switch } from "../../components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../../components/ui/menu";

const initialConversations = [
  {
    id: "lin",
    name: "林晨",
    description: "新的界面方案已整理好，一起看看吧。",
    avatar: "林",
    color: "bg-accent-100 text-accent-900",
  },
  {
    id: "zhou",
    name: "周可",
    description: "明天下午三点见，稍后发你会议安排。",
    avatar: "周",
    color: "bg-success-100 text-success-900",
  },
  {
    id: "design",
    name: "设计讨论",
    description: "关于列表布局，大家还有哪些建议？",
    avatar: "设",
    color: "bg-warning-100 text-warning-900",
  },
  {
    id: "project",
    name: "项目协作",
    description: "本周的任务已更新，记得查看最新进度。",
    avatar: "项",
    color: "bg-surface-muted text-secondary",
  },
];

export function ListExamples() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverable, setHoverable] = useState(true);
  const [divided, setDivided] = useState(true);
  const [result, setResult] = useState("选择一条会话，或打开右侧操作菜单。");

  function openConversation(id: string, name: string) {
    setActiveId(id);
    setResult(`当前会话：${name}`);
  }

  return (
    <Card data-demo="conversation-list">
      <CardHeader>
        <CardTitle>List · 列表</CardTitle>
        <CardDescription>
          头像、名称与消息摘要，右侧提供会话操作；列表项之间用细分隔线区分。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2"><Switch checked={hoverable} onCheckedChange={setHoverable} />悬停反馈</label>
          <label className="flex items-center gap-2"><Switch checked={divided} onCheckedChange={setDivided} />分隔线</label>
        </div>
        <List
          aria-label="会话列表"
          hoverable={hoverable}
          divided={divided}
          className="rounded-lg bg-background"
        >
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              data-conversation={conversation.id}
              data-selected={activeId === conversation.id ? "" : undefined}
              className="data-selected:bg-surface-muted"
            >
              <ListItemMedia>
                <Avatar className={conversation.color} aria-hidden="true">
                  <AvatarFallback>{conversation.avatar}</AvatarFallback>
                </Avatar>
              </ListItemMedia>
              <ListItemMeta>
                <ListItemTitle>
                  <button
                type="button"
                aria-label={`打开与${conversation.name}的会话`}
                aria-pressed={activeId === conversation.id}
                onClick={() =>
                  openConversation(conversation.id, conversation.name)
                }
                className="block max-w-full cursor-pointer truncate text-left outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-accent-700 focus-visible:after:-outline-offset-2"
              >
                    {conversation.name}
                  </button>
                </ListItemTitle>
                <ListItemDescription>{conversation.description}</ListItemDescription>
              </ListItemMeta>
              <ListItemActions className="relative z-10">
              <Menu>
                <MenuTrigger
                  render={<Button onlyIcon variant="ghost" />}
                  aria-label={`${conversation.name}的会话操作`}
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                  </svg>
                </MenuTrigger>
                <MenuContent positionerProps={{ align: "end" }}>
                  <MenuItem
                    onClick={() =>
                      openConversation(conversation.id, conversation.name)
                    }
                  >
                    打开会话
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setConversations((current) => [
                        conversation,
                        ...current.filter(
                          (item) => item.id !== conversation.id,
                        ),
                      ]);
                      setResult(`已将${conversation.name}的会话移至顶部`);
                    }}
                  >
                    移至顶部
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    variant="danger"
                    onClick={() => {
                      setConversations((current) =>
                        current.filter((item) => item.id !== conversation.id),
                      );
                      if (activeId === conversation.id) setActiveId(null);
                      setResult(`已移除${conversation.name}的会话`);
                    }}
                  >
                    移除会话
                  </MenuItem>
                </MenuContent>
              </Menu>
              </ListItemActions>
            </ListItem>
          ))}
          {conversations.length === 0 && (
            <ListItem hoverable={false} className="p-0">
              <Empty className="bg-transparent" aria-labelledby="empty-conversations-title">
                <EmptyHeader>
                  <EmptyIcon><PlusIcon /></EmptyIcon>
                  <EmptyTitle id="empty-conversations-title">暂无会话</EmptyTitle>
                  <EmptyDescription>会话已全部移除，可以恢复示例内容继续体验。</EmptyDescription>
                </EmptyHeader>
                <EmptyActions>
                  <Button onClick={() => { setConversations(initialConversations); setActiveId(null); setResult("已恢复示例会话。"); }}>恢复示例会话</Button>
                </EmptyActions>
              </Empty>
            </ListItem>
          )}
        </List>
        <p role="status" className="text-label text-secondary">
          {result}
        </p>
        <section className="space-y-3 pt-4">
          <h4 className="font-medium">Logo / 图标 · 无分隔线、无悬停反馈</h4>
          <List size="sm" divided={false} aria-label="应用列表" className="rounded-lg bg-background">
            {[{ name: "文件空间", description: "管理文件与共享内容", symbol: "F" }, { name: "项目日历", description: "查看近期安排", symbol: "C" }].map(app => (
              <ListItem key={app.name}>
                <ListItemMedia><span aria-hidden="true" className="flex size-10 items-center justify-center rounded-lg bg-surface-muted">{app.symbol}</span></ListItemMedia>
                <ListItemMeta><ListItemTitle>{app.name}</ListItemTitle><ListItemDescription>{app.description}</ListItemDescription></ListItemMeta>
                <ListItemActions><Button size="sm" variant="secondary" aria-label={`打开${app.name}`} onClick={() => setResult(`已打开${app.name}`)}>打开</Button></ListItemActions>
              </ListItem>
            ))}
          </List>
        </section>
      </CardContent>
    </Card>
  );
}
