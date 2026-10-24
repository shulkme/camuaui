"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { InputNumber } from "../../components/ui/input-number";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Combobox,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxValue,
} from "../../components/ui/combobox";
import { Segmented, SegmentedItem } from "../../components/ui/segmented";
import { Switch } from "../../components/ui/switch";
import { PlusIcon } from "../../components/ui/icons";

const options = ["苹果", "香蕉", "橙子"];
const selectOptions = options.map((value) => ({ value, label: value }));

export function ControlSizeExamples() {
  return (
    <section
      aria-labelledby="control-sizes-title"
      className="space-y-4"
      data-demo="control-sizes"
    >
      <div className="space-y-1">
        <h4 id="control-sizes-title" className="font-medium">
          统一尺寸 · sm / md / lg
        </h4>
        <p className="text-label text-tertiary">
          小尺寸 32px，默认中尺寸 36px，大尺寸 40px；组合组件只需在根组件指定
          size。
        </p>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {(["sm", "md", "lg"] as const).map((size, index) => {
          // Omit the middle size to demonstrate the default, rather than setting md explicitly.
          const explicitSize = size === "md" ? undefined : size;
          return (
            <div
              key={size}
              data-size-example={size}
              className="min-w-0 space-y-5 rounded-lg bg-background p-5"
            >
              <h5 className="font-medium">
                {size} · {32 + index * 4}px{size === "md" ? " · 默认" : ""}
              </h5>
              <div
                data-size-component="button"
                className="flex flex-wrap items-center gap-2"
              >
                <Button size={explicitSize}>保存</Button>
                <Button
                  size={explicitSize}
                  variant="outline"
                  onlyIcon
                  aria-label={`添加 ${size}`}
                >
                  <PlusIcon />
                </Button>
              </div>
              <div data-size-component="input">
                <Input
                  size={explicitSize}
                  aria-label={`输入框 ${size}`}
                  placeholder="输入内容…"
                />
              </div>
              <div data-size-component="select">
                <Select
                  size={explicitSize}
                  items={selectOptions}
                  defaultValue="苹果"
                >
                  <SelectTrigger aria-label={`选择器 ${size}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div data-size-component="combobox">
                <Combobox size={explicitSize} items={options}>
                  <ComboboxInputGroup>
                    <ComboboxInput
                      aria-label={`搜索选择 ${size}`}
                      placeholder="搜索并选择…"
                    />
                    <ComboboxClear />
                    <ComboboxTrigger />
                  </ComboboxInputGroup>
                  <ComboboxContent>
                    <ComboboxList>
                      {(value: string) => (
                        <ComboboxItem key={value} value={value}>
                          {value}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div data-size-component="combobox-multiple">
                <Combobox
                  size={explicitSize}
                  items={options}
                  multiple
                  defaultValue={["苹果"]}
                >
                  <ComboboxInputGroup>
                    <ComboboxValue>
                      {(values: string[]) => (
                        <ComboboxChips aria-label={`已选水果 ${size}`}>
                          {values.map((value) => (
                            <ComboboxChip key={value} aria-label={value}>
                              {value}
                              <ComboboxChipRemove
                                aria-label={`移除 ${value} ${size}`}
                              />
                            </ComboboxChip>
                          ))}
                          <ComboboxInput
                            className="w-auto basis-12"
                            aria-label={`多选搜索 ${size}`}
                          />
                        </ComboboxChips>
                      )}
                    </ComboboxValue>
                    <ComboboxTrigger />
                  </ComboboxInputGroup>
                  <ComboboxContent>
                    <ComboboxList>
                      {(value: string) => (
                        <ComboboxItem key={value} value={value}>
                          {value}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
              <div data-size-component="input-number">
                <InputNumber
                  size={explicitSize}
                  defaultValue={2}
                  min={0}
                  max={5}
                  inputProps={{ "aria-label": `数量 ${size}` }}
                />
              </div>
              <div data-size-component="segmented">
                <Segmented
                  size={explicitSize}
                  defaultValue="day"
                  aria-label={`统计周期 ${size}`}
                >
                  <SegmentedItem value="day">日</SegmentedItem>
                  <SegmentedItem value="week">周</SegmentedItem>
                  <SegmentedItem value="month">月</SegmentedItem>
                </Segmented>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="flex flex-wrap items-center gap-6"
        data-demo="switch-sizes"
      >
        <label className="flex items-center gap-3 text-body">
          <Switch size="sm" />
          小开关 · 16px
        </label>
        <label className="flex items-center gap-3 text-body">
          <Switch defaultChecked />
          默认开关 · 20px
        </label>
      </div>
    </section>
  );
}
