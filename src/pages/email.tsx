"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { Alert, Button, Card, CardContent, Field, Input, KitLink, PageHeader } from "@neton/application-client-kit";

/**
 * 绑定 / 更换邮箱：验证码发到**新**邮箱，填对才生效 —— 证明这个邮箱确实归你，
 * 免得有人把别人的邮箱挂到自己账号上，或者手滑填错后再也收不到找回密码的邮件。
 */
export default function Page() {
  const [current, setCurrent] = React.useState<string | null | undefined>(undefined);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    apiFetch<{ email?: string | null }>("/app/member/user/get").then((p) => setCurrent(p.email ?? null)).catch((e: Error) => setError(e.message));
  }, []);
  React.useEffect(load, [load]);
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function send() {
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/send-email-code", "POST", { email: email.trim(), scene: "bind_email" });
      setSent(true); setCooldown(60); setNotice(`验证码已发送到 ${email.trim()}，5 分钟内有效`);
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  async function bind(event: React.FormEvent) {
    event.preventDefault();
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/bind-email", "PUT", { email: email.trim(), code: code.trim() });
      setNotice("邮箱已绑定"); setEmail(""); setCode(""); setSent(false); load();
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title={current ? "更换邮箱" : "绑定邮箱"} description="验证码会发到新邮箱，验证通过后才会生效" />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="info">{notice}</Alert> : null}
      <Card className="max-w-xl">
        <CardContent className="py-5">
          <form onSubmit={bind} className="flex flex-col gap-3">
            <Field label="当前邮箱"><Input value={current === undefined ? "" : current ?? "未绑定"} readOnly disabled /></Field>
            <Field label={current ? "新邮箱" : "邮箱地址"}>
              <div className="flex gap-2">
                <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false); }} placeholder="you@example.com" autoComplete="email" />
                <Button type="button" variant="secondary" onClick={() => void send()} disabled={busy || !emailOk || cooldown > 0 || email.trim().toLowerCase() === current?.toLowerCase()}>
                  {cooldown > 0 ? `${cooldown} 秒后重发` : sent ? "重新发送" : "发送验证码"}
                </Button>
              </div>
            </Field>
            <Field label="验证码"><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6 位数字" inputMode="numeric" autoComplete="one-time-code" disabled={!sent} /></Field>
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
