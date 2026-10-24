"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Empty, EmptyHeader, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions, EmptyExtra } from "../../components/ui/empty";
import { PlusIcon, SearchIcon } from "../../components/ui/icons";
import { List, ListItem, ListItemMedia, ListItemMeta, ListItemTitle, ListItemDescription, ListItemActions } from "../../components/ui/list";

function FolderIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 9h18" />
    </svg>
  );
}

export function EmptyExamples() {
  const [project, setProject] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterCleared, setFilterCleared] = useState(false);

  return (
    <Card data-demo="empty">
      <CardHeader>
        <CardTitle>Empty · 空状态</CardTitle>
        <CardDescription>用于列表无数据时的操作引导，可组合图标、描述、操作按钮和额外内容。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3" aria-labelledby="empty-onboarding-example">
          <h4 id="empty-onboarding-example" className="font-medium">首次使用 · 创建引导</h4>
          {project ? (
            <div className="space-y-3">
              <List aria-label="项目列表" className="rounded-lg bg-background">
                <ListItem>
                  <ListItemMedia><span aria-hidden="true" className="flex size-10 items-center justify-center rounded-lg bg-surface-muted [&>svg]:size-5"><FolderIcon /></span></ListItemMedia>
                  <ListItemMeta>
                    <ListItemTitle>{project}</ListItemTitle>
                    <ListItemDescription>项目已创建，可以开始添加内容。</ListItemDescription>
                  </ListItemMeta>
                  <ListItemActions><Button variant="ghost" onClick={() => { setProject(null); setShowTemplates(false); }}>移除项目</Button></ListItemActions>
                </ListItem>
              </List>
              <p role="status" className="text-label text-secondary">已创建「{project}」。移除项目可再次查看空状态。</p>
            </div>
          ) : (
            <Empty className="bg-background" aria-labelledby="empty-project-title" aria-describedby="empty-project-description">
              <EmptyHeader>
                <EmptyIcon><FolderIcon /></EmptyIcon>
                <EmptyTitle id="empty-project-title">还没有项目</EmptyTitle>
                <EmptyDescription id="empty-project-description">创建你的第一个项目，把任务、文件和协作内容整理到一起。</EmptyDescription>
              </EmptyHeader>
              <EmptyActions>
                <Button onClick={() => setProject("我的第一个项目")}><PlusIcon />创建项目</Button>
                <Button variant="outline" aria-expanded={showTemplates} aria-controls={showTemplates ? "empty-project-templates" : undefined} onClick={() => setShowTemplates(!showTemplates)}>查看模板</Button>
              </EmptyActions>
              <EmptyExtra>
                <p>也可以从模板开始，之后随时调整项目内容。</p>
                {showTemplates && (
                  <div id="empty-project-templates" className="flex flex-wrap justify-center gap-2">
                    {["团队计划", "个人待办"].map(name => <Button key={name} variant="secondary" onClick={() => setProject(name)}>{name}</Button>)}
                  </div>
                )}
              </EmptyExtra>
            </Empty>
          )}
        </section>

        <section className="space-y-3" aria-labelledby="empty-search-example">
          <h4 id="empty-search-example" className="font-medium">筛选无结果 · 可省略标题和 extra</h4>
          {filterCleared ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-background p-4">
              <p role="status" className="text-secondary">已清除筛选，可以重新浏览全部内容。</p>
              <Button variant="secondary" onClick={() => setFilterCleared(false)}>重新应用筛选</Button>
            </div>
          ) : (
            <Empty className="bg-background" aria-label="筛选无结果">
              <EmptyHeader>
                <EmptyIcon><SearchIcon /></EmptyIcon>
                <EmptyDescription>没有找到相关内容，试试其他关键词，或清除当前筛选。</EmptyDescription>
              </EmptyHeader>
              <EmptyActions><Button variant="outline" onClick={() => setFilterCleared(true)}>清除筛选</Button></EmptyActions>
            </Empty>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
