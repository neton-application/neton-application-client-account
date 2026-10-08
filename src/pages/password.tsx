"use client";

import * as React from "react";
import { apiWrite } from "@neton/application-client-runtime/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Field, Input, PageHeader } from "@neton/application-client-kit";

/** 修改密码：必须输入当前密码，后端同样校验。忘记当前密码请走登录页的「找回密码」。 */
export default function Page() {
  const [pw, setPw] = React.useState({ old: "", next: "", confirm: "" });
  const [msg, setMsg] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMsg(null);
    if (pw.next.length < 8) { setMsg("新密码至少 8 位"); return; }
    if (pw.next !== pw.confirm) { setMsg("两次输入的新密码不一致"); return; }
    setBusy(true);
    try {
      await apiWrite("/app/member/user/update-password", "PUT", { oldPassword: pw.old, newPassword: pw.next });
      setPw({ old: "", next: "", confirm: "" }); setMsg("密码已更新，下次登录请使用新密码");
    } catch (cause) { setMsg((cause as Error).message); } finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader eyebrow="ACCOUNT" title="修改密码" description="需要先输入当前密码；忘记密码请在登录页找回。" />
      <Card style={{ maxWidth: 520 }}>
        <CardHeader><CardTitle>设置新密码</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <Field label="当前密码"><Input type="password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} autoComplete="current-password" /></Field>
            <Field label="新密码（至少 8 位）"><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
            <Field label="确认新密码"><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
            {msg ? <p style={{ fontSize: 13, margin: "6px 0 0" }}>{msg}</p> : null}
            <div style={{ marginTop: 12 }}><Button type="submit" disabled={busy || !pw.old || !pw.next || !pw.confirm}>{busy ? "提交中…" : "更新密码"}</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
