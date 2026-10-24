"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "../../components/ui/button";
import {
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
} from "../../components/ui/icons";
import { Segmented, SegmentedItem } from "../../components/ui/segmented";

type Theme = "system" | "light" | "dark";

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" ? value : "system";
}

function readServerTheme(): Theme {
  return "system";
}

export function ThemeControls() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    readServerTheme,
  );

  function selectTheme(value: Theme) {
    if (value === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", value);
    }
  }

  return (
    <Segmented<Theme>
      aria-label="预览主题"
      value={theme}
      onValueChange={selectTheme}
    >
      {(
        [
          ["system", "跟随系统"],
          ["light", "亮色"],
          ["dark", "暗色"],
        ] as const
      ).map(([value, label]) => (
        <SegmentedItem key={value} value={value}>
          {label}
        </SegmentedItem>
      ))}
    </Segmented>
  );
}

export function ButtonExamples() {
  const [action, setAction] = useState(
    "点击任意按钮查看反馈，也可用 Tab 检查焦点。",
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-label font-medium text-secondary">操作层级</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setAction("已触发主操作示例：保存设置。")}>
            保存设置
          </Button>
          <Button
            variant="secondary"
            onClick={() => setAction("已触发次要操作示例：取消。")}
          >
            取消
          </Button>
          <Button
            variant="outline"
            onClick={() => setAction("已触发描边按钮示例。")}
          >
            描边按钮
          </Button>
          <Button
            variant="ghost"
            onClick={() => setAction("已触发轻量操作示例：查看详情。")}
          >
            查看详情
          </Button>
          <Button
            variant="danger"
            onClick={() => setAction("已触发危险操作示例，未执行真实删除。")}
          >
            删除账号
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-label font-medium text-secondary">
          尺寸与禁用状态
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAction("小尺寸：32px，适合紧凑布局。")}
          >
            小按钮
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() =>
              setAction("默认中尺寸：36px，作为表单与操作控件的基准。")
            }
          >
            默认按钮
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() =>
              setAction("大尺寸：40px，适合需要更大操作区域的场景。")
            }
          >
            大按钮
          </Button>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button
              key={size}
              onlyIcon
              size={size}
              variant="secondary"
              aria-label={size === "md" ? "添加示例" : `添加示例（${size}）`}
              onClick={() => setAction(`已触发 ${size} 图标按钮示例。`)}
            >
              <PlusIcon />
            </Button>
          ))}
          <Button disabled onClick={() => setAction("禁用按钮不应触发。")}>
            暂不可用
          </Button>
        </div>
      </div>
      <div className="space-y-3" data-demo="button-icon-text">
        <h3 className="text-label font-medium text-secondary">图标与文字</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setAction("已触发前置图标按钮示例：新建项目。")}
          >
            <PlusIcon />
            新建项目
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setAction("已触发前置图标按钮示例：保存更改。")}
          >
            <CheckIcon />
            保存更改
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setAction("已触发后置图标按钮示例：展开选项。")}
          >
            展开选项
            <ChevronDownIcon />
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-label font-medium text-secondary">工具类自定义</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="px-6 text-label"
            onClick={() =>
              setAction("已应用间距与字号覆盖，保留默认胶囊圆角。")
            }
          >
            自定义外观
          </Button>
          <Button
            variant="secondary"
            className={(state) => (state.disabled ? "text-quaternary" : "px-6")}
            onClick={() => setAction("已应用状态函数形式的 className。")}
          >
            状态类名
          </Button>
        </div>
      </div>
      <p
        role="status"
        className="rounded-lg bg-surface-muted px-4 py-3 text-body text-tertiary"
      >
        {action}
      </p>
    </div>
  );
}
