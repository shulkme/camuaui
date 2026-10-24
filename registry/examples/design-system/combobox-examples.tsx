"use client";

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type Ref,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Combobox,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxValue,
  ComboboxLabel,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxCollection,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxSearchInput,
  ComboboxStatus,
  createComboboxItems,
  useComboboxFilter,
  useComboboxFilteredItems,
  type ComboboxProps,
} from "../../components/ui/combobox";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "../../components/ui/modal";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { PlusIcon } from "../../components/ui/icons";

type Option = { id: string; label: string; description?: string };
const fruits: Option[] = [
  { id: "apple", label: "苹果" },
  { id: "banana", label: "香蕉" },
  { id: "orange", label: "橙子" },
  { id: "grape", label: "葡萄" },
  { id: "mango", label: "芒果" },
  { id: "pear", label: "梨" },
];
const languages: Option[] = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Java",
].map((label) => ({ id: label, label }));
const fruitIds = createComboboxItems(fruits, {
  getValue: (item) => item.id,
  getLabel: (item) => item.label,
});

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
      data-combobox-example={id}
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

function SingleInput({
  label,
  placeholder = "输入关键词…",
  inputRef,
}: {
  label: string;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-body font-medium">
        {label}
      </label>
      <ComboboxInputGroup>
        <ComboboxInput ref={inputRef} id={id} placeholder={placeholder} />
        <ComboboxClear />
        <ComboboxTrigger />
      </ComboboxInputGroup>
    </div>
  );
}

function MultipleInput({
  label,
  value,
  inputRef,
}: {
  label: string;
  value: Option[];
  inputRef?: Ref<HTMLInputElement>;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-body font-medium">
        {label}
      </label>
      <ComboboxInputGroup>
        <ComboboxChips
          aria-label={value.length ? `已选择的${label}` : undefined}
        >
          {value.map((item) => (
            <ComboboxChip
              key={item.id}
              aria-label={item.label}
              aria-description="按退格或 Delete 移除"
            >
              {item.label}
              <ComboboxChipRemove aria-label={`移除 ${item.label}`} />
            </ComboboxChip>
          ))}
          <ComboboxInput
            ref={inputRef}
            id={id}
            className="w-auto basis-20"
            placeholder={value.length ? "" : "搜索并选择…"}
            aria-description={
              value.length
                ? "在输入开头按左方向键可访问已选标签，按退格或 Delete 移除。"
                : undefined
            }
          />
        </ComboboxChips>
        <ComboboxTrigger />
      </ComboboxInputGroup>
    </div>
  );
}

function OptionsPopup() {
  return (
    <ComboboxContent>
      <ComboboxEmpty>没有匹配的选项</ComboboxEmpty>
      <ComboboxList>
        {(item: Option) => (
          <ComboboxItem key={item.id} value={item}>
            {item.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  );
}

// A typed wrapper preserves Value / Multiple / Item inference from Base UI.
function TypedCombobox<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>(props: ComboboxProps<Value, Multiple, Item>) {
  return <Combobox {...props} />;
}

function Basic() {
  const [value, setValue] = useState<Option | null>(null);
  return (
    <>
      <TypedCombobox
        items={fruits}
        value={value}
        onValueChange={setValue}
        autoHighlight
      >
        <SingleInput label="选择水果" placeholder="例如：苹果" />
        <OptionsPopup />
      </TypedCombobox>
      <Result>已选：{value?.label ?? "未选择"}</Result>
    </>
  );
}

function SelectIds() {
  const [value, setValue] = useState<string | null>("banana");
  return (
    <>
      <Combobox
        items={fruitIds}
        value={value}
        onValueChange={setValue}
        name="fruitId"
      >
        <SingleInput label="保存水果 ID" />
        <ComboboxContent>
          <ComboboxEmpty>没有匹配的水果</ComboboxEmpty>
          <ComboboxList>
            {(item: Option) => (
              <ComboboxItem key={item.id} value={item.id}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Result>保存的 ID：{value ?? "空"}</Result>
    </>
  );
}

function Multiple() {
  const [value, setValue] = useState<Option[]>([languages[0]]);
  return (
    <>
      <Combobox
        items={languages}
        multiple
        value={value}
        onValueChange={setValue}
      >
        <MultipleInput label="开发语言" value={value} />
        <OptionsPopup />
      </Combobox>
      <Result>
        已选 {value.length} 项：
        {value.map((item) => item.label).join("、") || "无"}
      </Result>
    </>
  );
}

function InsidePopup() {
  const [value, setValue] = useState<Option | null>(null);
  return (
    <>
      <Combobox items={fruits} value={value} onValueChange={setValue}>
        <ComboboxLabel>在浮层中搜索</ComboboxLabel>
        <ComboboxTrigger variant="input">
          <ComboboxValue>
            {(selected: Option | null) => selected?.label ?? "选择水果…"}
          </ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent
          aria-label="搜索水果"
          header={
            <ComboboxSearchInput
              aria-label="过滤水果"
              placeholder="搜索水果…"
            />
          }
        >
          <ComboboxEmpty>没有匹配的水果</ComboboxEmpty>
          <ComboboxList>
            {(item: Option) => (
              <ComboboxItem key={item.id} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Result>已选：{value?.label ?? "未选择"}</Result>
    </>
  );
}

const groups = [
  { value: "水果", items: fruits.slice(0, 3) },
  {
    value: "蔬菜",
    items: [
      { id: "carrot", label: "胡萝卜" },
      { id: "lettuce", label: "生菜" },
      { id: "spinach", label: "菠菜" },
    ],
  },
];
function Grouped() {
  const [value, setValue] = useState<Option | null>(null);
  return (
    <>
      <Combobox items={groups} value={value} onValueChange={setValue}>
        <SingleInput label="按分组选择" />
        <ComboboxContent>
          <ComboboxEmpty>没有匹配的食材</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof groups)[number]) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                <ComboboxCollection>
                  {(item: Option) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Result>已选：{value?.label ?? "未选择"}</Result>
    </>
  );
}

const directory: Option[] = [
  { id: "lin", label: "林晓", description: "lin@example.com" },
  { id: "chen", label: "陈宁", description: "chen@example.com" },
  { id: "zhou", label: "周舟", description: "zhou@example.com" },
  { id: "wang", label: "王琳", description: "wang@example.com" },
];

function useDirectorySearch(query: string) {
  const [results, setResults] = useState<Option[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const { contains } = useComboboxFilter();
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setResults([]);
    setStatus("loading");
    // Local request simulation: keep the examples usable offline and on React 18.
    const timer = setTimeout(() => {
      if (controller.signal.aborted) return;
      if (query.trim().toLowerCase() === "error") {
        setResults([]);
        setStatus("error");
        return;
      }
      setResults(
        directory.filter(
          (item) =>
            contains(item.label, query.trim()) ||
            contains(item.description ?? "", query.trim()),
        ),
      );
      setStatus("ready");
    }, 450);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, contains]);
  return { results, status };
}

function AsyncPopup({
  status,
  hasResults,
  hasSelection,
}: {
  status: "idle" | "loading" | "ready" | "error";
  hasResults: boolean;
  hasSelection: boolean;
}) {
  const message =
    status === "loading"
      ? "正在搜索…"
      : status === "error"
        ? "搜索失败，请修改关键词重试。"
        : status === "idle" && !hasSelection
          ? "输入姓名或邮箱开始搜索"
          : status === "ready" && !hasResults
            ? "没有匹配的用户，请尝试其它关键词。"
            : null;
  return (
    <ComboboxContent aria-busy={status === "loading" || undefined}>
      <ComboboxStatus>{message}</ComboboxStatus>
      <ComboboxEmpty>
        {status === "ready" && !hasResults ? "也可以使用邮箱搜索。" : null}
      </ComboboxEmpty>
      <ComboboxList>
        {(item: Option) => (
          <ComboboxItem key={item.id} value={item}>
            <span className="min-w-0">
              <span className="block">{item.label}</span>
              <span className="block text-label text-tertiary">
                {item.description}
              </span>
            </span>
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  );
}

function AsyncSingle() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<Option | null>(null);
  const { results, status } = useDirectorySearch(query);
  const items = useMemo(
    () =>
      value && !results.some((item) => item.id === value.id)
        ? [...results, value]
        : results,
    [results, value],
  );
  return (
    <>
      <Combobox
        items={items}
        value={value}
        filter={null}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onValueChange={(next) => {
          setValue(next);
          setQuery("");
        }}
        onInputValueChange={(text, { reason }) => {
          if (reason !== "item-press") setQuery(text);
        }}
      >
        <SingleInput
          label="搜索一位用户"
          placeholder="例如：林 / chen / error"
        />
        <AsyncPopup
          status={status}
          hasResults={results.length > 0}
          hasSelection={!!value}
        />
      </Combobox>
      <Result>已选：{value?.label ?? "未选择"}</Result>
    </>
  );
}

function AsyncMultiple() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<Option[]>([]);
  const { results, status } = useDirectorySearch(query);
  const items = useMemo(
    () => [
      ...results,
      ...value.filter(
        (selected) => !results.some((item) => item.id === selected.id),
      ),
    ],
    [results, value],
  );
  return (
    <>
      <Combobox
        items={items}
        multiple
        value={value}
        inputValue={query}
        filter={null}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
        onValueChange={(next) => {
          setValue(next);
          setQuery("");
        }}
        onInputValueChange={setQuery}
      >
        <MultipleInput label="搜索多位用户" value={value} />
        <AsyncPopup
          status={status}
          hasResults={results.length > 0}
          hasSelection={!!value.length}
        />
      </Combobox>
      <Result>
        已选 {value.length} 位：
        {value.map((item) => item.label).join("、") || "无"}
      </Result>
    </>
  );
}

type LabelOption = Option & { create?: string };
const initialLabels: LabelOption[] = [
  { id: "bug", label: "缺陷" },
  { id: "docs", label: "文档" },
  { id: "improvement", label: "改进" },
];
function Creatable() {
  const [labels, setLabels] = useState(initialLabels);
  const [value, setValue] = useState<LabelOption[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);
  const trimmed = query.trim();
  const items: LabelOption[] =
    trimmed &&
    !labels.some(
      (item) => item.label.toLocaleLowerCase() === trimmed.toLocaleLowerCase(),
    )
      ? [
          ...labels,
          {
            id: `create:${trimmed}`,
            label: `创建“${trimmed}”`,
            create: trimmed,
          },
        ]
      : labels;
  return (
    <>
      <Combobox
        items={items}
        multiple
        value={value}
        inputValue={query}
        onInputValueChange={setQuery}
        autoHighlight
        open={open}
        onOpenChange={setOpen}
        onValueChange={(next) => {
          const create = next.find((item) => item.create);
          if (create?.create) {
            setPending(create.create);
            setOpen(false);
            setModalOpen(true);
            return;
          }
          setValue(next);
          setQuery("");
        }}
      >
        <MultipleInput
          label="选择或创建标签"
          value={value}
          inputRef={inputRef}
        />
        <ComboboxContent>
          <ComboboxEmpty>输入文字可以创建标签</ComboboxEmpty>
          <ComboboxList>
            {(item: LabelOption) => (
              <ComboboxItem key={item.id} value={item}>
                <span className="flex items-center gap-2">
                  {item.create && <PlusIcon />}
                  {item.label}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Modal
        open={modalOpen}
        onOpenChange={(next) => {
          setModalOpen(next);
          if (!next) setQuery("");
        }}
      >
        <ModalContent initialFocus={createInputRef} finalFocus={inputRef}>
          <ModalTitle>创建标签</ModalTitle>
          <ModalDescription>
            确认名称后添加并选中，仅影响本地示例。
          </ModalDescription>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const label = createInputRef.current?.value.trim();
              if (!label) return;
              const existing = labels.find(
                (item) =>
                  item.label.toLocaleLowerCase() === label.toLocaleLowerCase(),
              );
              const item = existing ?? { id: `custom-${labels.length}`, label };
              if (!existing) setLabels((previous) => [...previous, item]);
              setValue((previous) =>
                previous.some((selected) => selected.id === item.id)
                  ? previous
                  : [...previous, item],
              );
              setModalOpen(false);
              setQuery("");
            }}
          >
            <Field className="mt-5">
              <FieldLabel>标签名称</FieldLabel>
              <Input ref={createInputRef} defaultValue={pending} required />
            </Field>
            <ModalFooter className="mt-6">
              <ModalClose render={<Button variant="secondary" />}>
                取消创建
              </ModalClose>
              <Button type="submit">创建并选择</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Result>
        已选：{value.map((item) => item.label).join("、") || "无"}
      </Result>
    </>
  );
}

const virtualItems: Option[] = Array.from({ length: 10000 }, (_, index) => ({
  id: String(index + 1),
  label: `选项 ${String(index + 1).padStart(5, "0")}`,
}));
type Virtualizer = ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
function VirtualRows({
  open,
  virtualizerRef,
}: {
  open: boolean;
  virtualizerRef: RefObject<Virtualizer | null>;
}) {
  const items = useComboboxFilteredItems<Option>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    enabled: open,
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 32,
    overscan: 8,
    paddingStart: 4,
    paddingEnd: 4,
    scrollPaddingStart: 4,
    scrollPaddingEnd: 4,
  });
  useImperativeHandle(virtualizerRef, () => virtualizer);
  const setScrollRef = useCallback(
    (element: HTMLDivElement | null) => {
      scrollRef.current = element;
      if (element) virtualizer.measure();
    },
    [virtualizer],
  );
  if (!items.length) return null;
  return (
    <div
      ref={setScrollRef}
      role="presentation"
      data-virtual-scroller=""
      className="max-h-[calc(var(--available-height)-1rem)] overflow-auto overscroll-contain"
      style={{ height: Math.min(256, virtualizer.getTotalSize()) }}
    >
      <div
        role="presentation"
        className="relative mx-1"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const item = items[row.index];
          if (!item) return null;
          return (
            <ComboboxItem
              key={row.key}
              index={row.index}
              data-index={row.index}
              ref={virtualizer.measureElement}
              value={item}
              aria-setsize={items.length}
              aria-posinset={row.index + 1}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: row.size,
                transform: `translateY(${row.start}px)`,
              }}
            >
              {item.label}
            </ComboboxItem>
          );
        })}
      </div>
    </div>
  );
}

function Virtualized() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Option | null>(null);
  const virtualizerRef = useRef<Virtualizer | null>(null);
  return (
    <>
      <Combobox
        virtualized
        items={virtualItems}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        onItemHighlighted={(item, { index, reason }) => {
          if (item && reason !== "pointer")
            queueMicrotask(() =>
              virtualizerRef.current?.scrollToIndex(index, { align: "auto" }),
            );
        }}
      >
        <SingleInput label="搜索 10,000 个选项" placeholder="例如：09999" />
        <ComboboxContent>
          <ComboboxEmpty>没有匹配的选项</ComboboxEmpty>
          <ComboboxList className="max-h-none overflow-visible p-0">
            <VirtualRows open={open} virtualizerRef={virtualizerRef} />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Result>已选：{value?.label ?? "未选择"}</Result>
    </>
  );
}

export function ComboboxExamples() {
  return (
    <Card data-demo="combobox-examples">
      <CardHeader>
        <CardTitle>Combobox · 场景示例</CardTitle>
        <CardDescription>
          输入搜索、单选与多选，默认高 36px，支持 32px / 40px，浮层圆角为 8px。
          <a
            className="ml-1 underline underline-offset-4 hover:text-primary"
            href="https://base-ui.com/react/components/combobox#examples"
            target="_blank"
            rel="noreferrer"
          >
            官方用法
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Example
          id="basic"
          title="基础选择与类型封装"
          description="保留 Value、Multiple、Item 泛型；支持搜索、清空与键盘选择。"
        >
          <Basic />
        </Example>
        <Example
          id="ids"
          title="使用 ID 作为值"
          description="输入展示名称，状态与表单提交只保存 ID。"
        >
          <SelectIds />
        </Example>
        <Example
          id="multiple"
          title="多选与标签"
          description="支持多选、移除标签，以及方向键与退格操作。"
        >
          <Multiple />
        </Example>
        <Example
          id="inside"
          title="浮层内搜索"
          description="搜索框仅保留底部分隔线，2px 焦点高光内收并留出 1px 间距。"
        >
          <InsidePopup />
        </Example>
        <Example
          id="grouped"
          title="分组选择"
          description="带标签的分组与过滤，隐藏无匹配结果的分组。"
        >
          <Grouped />
        </Example>
        <Example
          id="async-single"
          title="异步搜索 · 单选"
          description="本地模拟请求、加载、空结果与失败；输入 error 可体验错误状态。"
        >
          <AsyncSingle />
        </Example>
        <Example
          id="async-multiple"
          title="异步搜索 · 多选"
          description="继续搜索其它用户时保留已选标签，取消过期请求。"
        >
          <AsyncMultiple />
        </Example>
        <Example
          id="creatable"
          title="创建新选项"
          description="搜索没有的标签，选择创建项并在对话框中确认名称。"
        >
          <Creatable />
        </Example>
        <Example
          id="virtualized"
          title="虚拟列表"
          description="10,000 个选项仅渲染可见区域，支持过滤与键盘导航。"
        >
          <Virtualized />
        </Example>
      </CardContent>
    </Card>
  );
}
