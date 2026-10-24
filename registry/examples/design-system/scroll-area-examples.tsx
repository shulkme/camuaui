"use client";

import { ScrollArea } from "../../components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";

const rows = Array.from({ length: 24 }, (_, index) => index + 1);

export function ScrollAreaExamples() {
  return (
    <Card data-demo="scroll-area">
      <CardHeader>
        <CardTitle>ScrollArea · 滚动区域</CardTitle>
        <CardDescription>鼠标进入时显示细尺寸浅灰色滚动条；渐变变体随滚动位置淡化内容边缘。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        <section className="min-w-0 space-y-3">
          <h4 className="text-body font-medium">纵向列表</h4>
          <ScrollArea className="h-56 bg-surface-muted" viewportProps={{ "aria-label": "纵向滚动示例" }} contentProps={{ className: "space-y-3 p-4" }}>
            {rows.map((index) => <p key={index} className="text-body text-secondary">第 {index} 条记录</p>)}
          </ScrollArea>
        </section>
        <section className="min-w-0 space-y-3">
          <h4 className="text-body font-medium">渐变区域 · 官网示例</h4>
          <ScrollArea variant="fade" className="h-56 bg-surface-muted" viewportProps={{ "aria-label": "渐变滚动示例" }} contentProps={{ className: "space-y-4 p-4 text-body text-secondary" }}>
            <p>较长的内容可以放在固定高度的区域中，通过滚动查看后续段落。渐变只作用于可继续滚动的边缘，提示这里还有未展示的内容。</p>
            <p>停留在顶部时，上方内容保持清晰；向下滚动后，上边缘会逐渐淡出，底部继续保留柔和的渐变。接近底部时，下方渐变逐渐减弱。</p>
            <p>渐变直接使用 Base UI 提供的溢出距离变量驱动，不依赖额外的滚动监听。内容长度或容器尺寸发生变化时，显示状态会自动更新。</p>
            <p>滚动到最后一段，上方仍有可回看的内容，而下方已经没有更多内容，因此只保留顶部的渐变。鼠标离开区域后，滚动条淡出。</p>
            <p>同样的变体也可以配合横向或双向滚动，在对应方向的边缘显示渐变。键盘聚焦区域后可继续滚动查看内容。</p>
          </ScrollArea>
        </section>
        <section className="min-w-0 space-y-3">
          <h4 className="text-body font-medium">横向卡片</h4>
          <ScrollArea orientation="horizontal" className="h-56 bg-surface-muted" viewportProps={{ "aria-label": "横向滚动示例" }} contentProps={{ className: "flex w-max gap-3 p-4" }}>
            {rows.slice(0, 8).map((index) => <div key={index} className="flex h-40 w-36 shrink-0 items-center justify-center rounded-lg bg-surface text-body text-secondary">内容 {index}</div>)}
          </ScrollArea>
        </section>
        <section className="min-w-0 space-y-3">
          <h4 className="text-body font-medium">双向表格</h4>
          <ScrollArea orientation="both" className="h-56 bg-surface-muted" viewportProps={{ "aria-label": "双向滚动示例" }} contentProps={{ className: "p-4" }}>
            <table className="w-[40rem] text-left text-body">
              <thead><tr>{["编号", "名称", "分类", "更新时间"].map((heading) => <th key={heading} className="pb-3 font-medium">{heading}</th>)}</tr></thead>
              <tbody>{rows.map((index) => <tr key={index} className="text-secondary"><td className="py-2">{index}</td><td>示例条目 {index}</td><td>文档</td><td>今天</td></tr>)}</tbody>
            </table>
          </ScrollArea>
        </section>
      </CardContent>
    </Card>
  );
}
