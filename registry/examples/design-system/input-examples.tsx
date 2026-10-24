"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteInput, AutocompleteInputGroup, AutocompleteTrigger, AutocompleteClear, AutocompleteContent, AutocompleteList, AutocompleteItem, AutocompleteEmpty, AutocompleteGroup, AutocompleteGroupLabel, AutocompleteCollection } from "../../components/ui/autocomplete";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../../components/ui/input-otp";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Field, FieldLabel, FieldDescription, FieldError } from "../../components/ui/field";
import { Form } from "../../components/ui/form";
import { SearchIcon } from "../../components/ui/icons";
import type { ControlSize } from "../../components/ui/styles";

const sizes: ControlSize[] = ["sm", "md", "lg"];
const suggestions = ["项目规划", "项目进度", "项目归档", "团队协作", "设计规范", "使用指南"];
const destinations = [
  { value: "国内", items: [{ id: "hangzhou", label: "杭州" }, { id: "shanghai", label: "上海" }] },
  { value: "海外", items: [{ id: "tokyo", label: "东京" }, { id: "singapore", label: "新加坡" }] },
];

function SuggestionList() {
  return (
    <AutocompleteContent>
      <AutocompleteEmpty>暂无建议，仍可使用当前输入</AutocompleteEmpty>
      <AutocompleteList>{(item: string) => <AutocompleteItem key={item} value={item}>{item}</AutocompleteItem>}</AutocompleteList>
    </AutocompleteContent>
  );
}

export function FormInputExamples() {
  const [code, setCode] = useState("");
  const [otpResult, setOtpResult] = useState("");
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  return (
    <>
      <Card data-demo="input-otp">
        <CardHeader>
          <CardTitle>InputOTP · 验证码</CardTitle>
          <CardDescription>三种尺寸，支持逐位输入、整段粘贴、退格、分组、掩码和表单校验。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {sizes.map((size) => (
              <Field key={size} name={`otp-size-${size}`}>
                <FieldLabel>{size} · {size === "sm" ? 32 : size === "md" ? 36 : 40}px{size === "md" ? "（默认）" : ""}</FieldLabel>
                <InputOTP {...(size === "md" ? {} : { size })} aria-label={`${size} 验证码`} />
              </Field>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Form onFormSubmit={(values) => setOtpResult(`已提交验证码：${String(values.verification)}`)}>
              <Field name="verification">
                <FieldLabel>分组与表单提交</FieldLabel>
                <InputOTP name="verification" value={code} onValueChange={setCode} required aria-label="分组验证码">
                  <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} />)}</InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} />)}</InputOTPGroup>
                </InputOTP>
                <FieldDescription>可直接粘贴完整的 6 位数字，提交仅用于本地演示。</FieldDescription>
                <FieldError match="valueMissing">请输入验证码。</FieldError>
                <FieldError match="tooShort">请输入完整的 6 位验证码。</FieldError>
              </Field>
              <Button type="submit" className="mt-3">提交验证码</Button>
              {otpResult && <p role="status" className="text-body text-secondary">{otpResult}</p>}
            </Form>
            <div className="space-y-5">
              <Field>
                <FieldLabel>字母与数字</FieldLabel>
                <InputOTP length={4} validationType="alphanumeric" normalizeValue={(value) => value.toUpperCase()} aria-label="字母数字验证码" />
              </Field>
              <Field>
                <FieldLabel>掩码</FieldLabel>
                <InputOTP length={4} mask defaultValue="1234" aria-label="掩码验证码" />
              </Field>
              <Field disabled>
                <FieldLabel>禁用</FieldLabel>
                <InputOTP length={4} defaultValue="1234" disabled aria-label="禁用验证码" />
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card data-demo="autocomplete">
        <CardHeader>
          <CardTitle>Autocomplete · 输入建议</CardTitle>
          <CardDescription>保留自由输入，建议项用于补全；支持三种尺寸、键盘选择、清空和分组。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {sizes.map((size) => (
              <Field key={size}>
                <FieldLabel>{size} · {size === "sm" ? 32 : size === "md" ? 36 : 40}px{size === "md" ? "（默认）" : ""}</FieldLabel>
                <Autocomplete items={suggestions} {...(size === "md" ? {} : { size })}>
                  <AutocompleteInputGroup>
                    <AutocompleteInput placeholder="输入项目或设计" aria-label={`${size} 输入建议`} />
                    <AutocompleteClear />
                    <AutocompleteTrigger />
                  </AutocompleteInputGroup>
                  <SuggestionList />
                </Autocomplete>
              </Field>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Form onFormSubmit={(values) => setSearchResult(`搜索：${String(values.query)}`)}>
              <Field name="query">
                <FieldLabel>自由输入与提交</FieldLabel>
                <Autocomplete name="query" items={suggestions} value={query} onValueChange={setQuery}>
                  <AutocompleteInputGroup>
                    <SearchIcon className="ml-2 shrink-0 text-tertiary" />
                    <AutocompleteInput placeholder="也可以输入建议之外的内容" />
                    <AutocompleteClear />
                  </AutocompleteInputGroup>
                  <SuggestionList />
                </Autocomplete>
              </Field>
              <Button type="submit" className="mt-3">搜索内容</Button>
              {searchResult && <p role="status" className="text-body text-secondary">{searchResult}</p>}
            </Form>
            <Field>
              <FieldLabel>分组建议 · 对象数据</FieldLabel>
              <Autocomplete items={destinations} itemToStringValue={(item) => item.label}>
                <AutocompleteInputGroup>
                  <AutocompleteInput placeholder="输入城市，或自行填写" />
                  <AutocompleteTrigger />
                </AutocompleteInputGroup>
                <AutocompleteContent>
                  <AutocompleteEmpty>暂无匹配城市</AutocompleteEmpty>
                  <AutocompleteList>
                    {(group: typeof destinations[number]) => (
                      <AutocompleteGroup key={group.value} items={group.items}>
                        <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
                        <AutocompleteCollection>
                          {(item: typeof group.items[number]) => <AutocompleteItem key={item.id} value={item}>{item.label}</AutocompleteItem>}
                        </AutocompleteCollection>
                      </AutocompleteGroup>
                    )}
                  </AutocompleteList>
                </AutocompleteContent>
              </Autocomplete>
            </Field>
            <Field>
              <FieldLabel>行内补全</FieldLabel>
              <Autocomplete items={suggestions} mode="both">
                <AutocompleteInput placeholder="输入后按方向键预览补全" />
                <SuggestionList />
              </Autocomplete>
            </Field>
            <Field disabled>
              <FieldLabel>禁用</FieldLabel>
              <Autocomplete items={suggestions} disabled>
                <AutocompleteInput placeholder="不可编辑" />
              </Autocomplete>
            </Field>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
