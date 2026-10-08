"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { useQuery, useQueryClient } from "@neton/application-client-runtime/client-context";
import { Alert, Button, Card, CardContent, Field, Input, KitLink, PageHeader, Select } from "@neton/application-client-kit";

/** 后端 SmsScene.MEMBER_UPDATE_MOBILE —— 换绑手机的验证码场景号 */
const SCENE_UPDATE_MOBILE = 2;

const COUNTRY_CODES = [
  { code: "+86", label: "中国大陆 +86" },
  { code: "+852", label: "中国香港 +852" },
  { code: "+853", label: "中国澳门 +853" },
  { code: "+886", label: "中国台湾 +886" },
  { code: "+1", label: "美国 / 加拿大 +1" },
  { code: "+44", label: "英国 +44" },
  { code: "+81", label: "日本 +81" },
  { code: "+82", label: "韩国 +82" },
  { code: "+65", label: "新加坡 +65" },
];

/**
 * 绑定 / 更换手机号：短信验证码发到**新**号码，填对才生效。后端要求 E.164（+8613812345678），
 * 这里拆成区号 + 号码两栏，免得用户自己拼。
 */
export default function Page() {
  const [cc, setCc] = React.useState("+86");
  const [number, setNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const client = useQueryClient();
  const profileQ = useQuery({ queryKey: ["member-self"], queryFn: () => apiFetch<{ mobile?: string | null }>("/app/member/user/get") });
  const current: string | null | undefined = profileQ.data ? profileQ.data.mobile ?? null : undefined;
  const load = () => client.invalidateQueries({ queryKey: ["member-self"] });
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const digits = number.replace(/\D/g, "");
  const e164 = `${cc}${digits}`;
  const numberOk = digits.length >= 5 && digits.length <= 14;

  async function send() {
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/send-sms-code", "POST", { mobile: e164, scene: SCENE_UPDATE_MOBILE });
      setSent(true); setCooldown(60); setNotice(`验证码已发送到 ${cc} ${digits}`);
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  async function bind(event: React.FormEvent) {
    event.preventDefault();
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/update-mobile", "PUT", { mobile: e164, smsCode: code.trim() });
      setNotice("手机号已绑定"); setNumber(""); setCode(""); setSent(false); load();
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title={current ? "更换手机号" : "绑定手机号"} description="验证码会发到新号码，验证通过后才会生效" />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="info">{notice}</Alert> : null}
      <Card className="max-w-xl">
        <CardContent className="py-5">
          <form onSubmit={bind} className="flex flex-col gap-3">
            <Field label="当前手机号"><Input value={current === undefined ? "" : current ?? "未绑定"} readOnly disabled /></Field>
            <Field label={current ? "新手机号" : "手机号"}>
              <div className="flex gap-2">
                <div className="w-40 shrink-0">
                  <Select value={cc} onChange={(e) => { setCc(e.target.value); setSent(false); }}>
                    {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </Select>
                </div>
                <Input value={number} onChange={(e) => { setNumber(e.target.value); setSent(false); }} placeholder="手机号码" inputMode="tel" autoComplete="tel-national" />
                <Button type="button" variant="secondary" onClick={() => void send()} disabled={busy || !numberOk || cooldown > 0 || e164 === current}>
                  {cooldown > 0 ? `${cooldown} 秒后重发` : sent ? "重新发送" : "发送验证码"}
                </Button>
              </div>
            </Field>
            <Field label="验证码"><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="短信中的数字验证码" inputMode="numeric" autoComplete="one-time-code" disabled={!sent} /></Field>
            <div className="mt-1 flex items-center gap-2">
              <Button type="submit" disabled={busy || !sent || code.trim().length < 4}>确认绑定</Button>
              <KitLink href="/member/profile" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">返回个人资料</KitLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
