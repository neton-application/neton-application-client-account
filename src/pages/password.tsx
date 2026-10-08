"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { Alert, Button, Card, CardContent, Field, Input, KitLink, PageHeader } from "@neton/application-client-kit";

/**
 * 设置 / 修改登录密码。已有密码时必须输入当前密码（后端同样校验）；
 * 短信或社交登录注册、从没设过密码的账号直接设置。忘记当前密码请走登录页的「找回密码」。
 */
export default function Page() {
  const [hasPassword, setHasPassword] = React.useState<boolean | null>(null);
  const [pw, setPw] = React.useState({ old: "", next: "", confirm: "" });
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    apiFetch<{ hasPassword?: boolean }>("/app/member/user/get")
      .then((p) => setHasPassword(p.hasPassword !== false))
      .catch(() => setHasPassword(true));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null); setDone(false);
    if (pw.next.length < 8) { setError("新密码至少 8 位"); return; }
    if (pw.next !== pw.confirm) { setError("两次输入的新密码不一致"); return; }
    setBusy(true);
    try {
      await apiWrite("/app/member/user/update-password", "PUT", { oldPassword: pw.old, newPassword: pw.next });
      setPw({ old: "", next: "", confirm: "" }); setDone(true); setHasPassword(true);
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  const title = hasPassword === false ? "设置密码" : "修改密码";
  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title={title} description={hasPassword === false ? "设置后可用用户名 + 密码登录" : "需要先输入当前密码；忘记密码请在登录页找回"} />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {done ? <Alert tone="info">密码已更新，下次登录请使用新密码</Alert> : null}
      <Card className="max-w-xl">
        <CardContent className="py-5">
          <form onSubmit={submit} className="flex flex-col gap-3">
            {hasPassword !== false ? (
              <Field label="当前密码"><Input type="password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} autoComplete="current-password" /></Field>
            ) : null}
            <Field label="新密码（至少 8 位）"><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
            <Field label="确认新密码"><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
            <div className="mt-1 flex items-center gap-2">
              <Button type="submit" disabled={busy || hasPassword === null || (hasPassword && !pw.old) || !pw.next || !pw.confirm}>{busy ? "提交中…" : "保存"}</Button>
              <KitLink href="/member/profile" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">返回个人资料</KitLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
