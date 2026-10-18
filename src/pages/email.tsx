"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { useDescribeError } from "@neton/application-client-runtime/errors";
import { useQuery, useQueryClient } from "@neton/application-client-runtime/client-context";
import { useT } from "@neton/application-client-runtime/i18n";
import { useTabTitle } from "@neton/application-client-runtime/workspace";
import { Alert, Button, Card, CardContent, Field, Input, KitLink, PageHeader } from "@neton/application-client-kit";

/**
 * 绑定 / 更换邮箱：验证码发到**新**邮箱，填对才生效 —— 证明这个邮箱确实归你，
 * 免得有人把别人的邮箱挂到自己账号上，或者手滑填错后再也收不到找回密码的邮件。
 */
export default function Page() {
  const describeError = useDescribeError("account");
  const t = useT("account");
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const client = useQueryClient();
  const profileQ = useQuery({ queryKey: ["account-self"], queryFn: () => apiFetch<{ email?: string | null }>("/app/member/user/get") });
  const current: string | null | undefined = profileQ.data ? profileQ.data.email ?? null : undefined;
  const load = () => client.invalidateQueries({ queryKey: ["account-self"] });
  useTabTitle(current ? t("email.titleChange") : t("email.titleBind"));
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function send() {
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/send-email-code", "POST", { email: email.trim(), scene: "bind_email" });
      setSent(true); setCooldown(60); setNotice(t("email.sent", { email: email.trim() }));
    } catch (cause) { setError(describeError(cause)); } finally { setBusy(false); }
  }

  async function bind(event: React.FormEvent) {
    event.preventDefault();
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/bind-email", "PUT", { email: email.trim(), code: code.trim() });
      setNotice(t("email.bound")); setEmail(""); setCode(""); setSent(false); load();
    } catch (cause) { setError(describeError(cause)); } finally { setBusy(false); }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title={current ? t("email.titleChange") : t("email.titleBind")} description={t("email.description")} />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="info">{notice}</Alert> : null}
      <Card className="max-w-xl">
        <CardContent className="py-5">
          <form onSubmit={bind} className="flex flex-col gap-3">
            <Field label={t("field.currentEmail")}><Input value={current === undefined ? "" : current ?? t("value.notBound")} readOnly disabled /></Field>
            <Field label={current ? t("field.newEmail") : t("field.emailAddress")}>
              <div className="flex gap-2">
                <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false); }} placeholder="you@example.com" autoComplete="email" />
                <Button type="button" variant="secondary" onClick={() => void send()} disabled={busy || !emailOk || cooldown > 0 || email.trim().toLowerCase() === current?.toLowerCase()}>
                  {cooldown > 0 ? t("value.cooldown", { seconds: cooldown }) : sent ? t("action.resend") : t("action.sendCode")}
                </Button>
              </div>
            </Field>
            <Field label={t("field.code")}><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("field.emailCodePlaceholder")} inputMode="numeric" autoComplete="one-time-code" disabled={!sent} /></Field>
            <div className="mt-1 flex items-center gap-2">
              <Button type="submit" disabled={busy || !sent || code.trim().length < 4}>{t("action.confirmBind")}</Button>
              <KitLink href="/account/profile" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">{t("backToProfile")}</KitLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
