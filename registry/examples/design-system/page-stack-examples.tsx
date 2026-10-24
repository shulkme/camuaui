"use client";

import { useState } from "react";
import { PageStack, PageStackPage } from "../../components/ui/page-stack";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

export function PageStackExamples() {
  const [page, setPage] = useState("settings");
  const [expanded, setExpanded] = useState(false);
  return (
    <Card data-demo="page-stack">
      <CardHeader>
        <CardTitle>PageStack · 页面切换</CardTitle>
        <CardDescription>前进向左滑入，返回向右滑入；高度跟随内容变化，返回后保留输入状态。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-lg rounded-2xl bg-background">
          <PageStack value={page} aria-label="设置页面切换">
            <PageStackPage value="settings" className="space-y-4 p-6" aria-label="设置">
              <h4 className="font-medium">设置</h4>
              <p className="text-secondary">选择需要编辑的项目。</p>
              <Button variant="secondary" onClick={() => setPage("profile")}>编辑个人资料 →</Button>
            </PageStackPage>
            <PageStackPage value="profile" className="space-y-4 p-6" aria-label="个人资料">
              <Button variant="ghost" onClick={() => setPage("settings")}>← 返回设置</Button>
              <h4 className="font-medium">个人资料</h4>
              <label className="block space-y-2"><span>显示名称</span><Input aria-label="显示名称" defaultValue="林" /></label>
              <p className="text-tertiary">输入内容后进入下一页，再返回查看。</p>
              <Button onClick={() => setPage("notifications")}>通知偏好 →</Button>
            </PageStackPage>
            <PageStackPage value="notifications" className="space-y-4 p-6" aria-label="通知偏好">
              <Button variant="ghost" onClick={() => setPage("profile")}>← 返回个人资料</Button>
              <h4 className="font-medium">通知偏好</h4>
              <label className="flex items-center justify-between gap-4">接收通知<Switch defaultChecked /></label>
              <Button variant="secondary" onClick={() => setExpanded(!expanded)}>{expanded ? "收起说明" : "展开说明"}</Button>
              {expanded && <p className="text-secondary">内容展开或异步加载后，容器高度也会平滑调整。系统开启减少动态效果时，页面直接切换。</p>}
              <div><Button onClick={() => setPage("settings")}>完成，返回设置</Button></div>
            </PageStackPage>
          </PageStack>
        </div>
      </CardContent>
    </Card>
  );
}
