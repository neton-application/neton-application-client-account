"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { useDescribeError } from "@neton/application-client-runtime/errors";
import { useQuery, useQueryClient } from "@neton/application-client-runtime/client-context";
import { useT } from "@neton/application-client-runtime/i18n";
import { useTabTitle } from "@neton/application-client-runtime/workspace";
import { Alert, Button, Card, CardContent, Field, Input, KitLink, PageHeader } from "@neton/application-client-kit";

/**
 * 设置 / 修改登录密码。已有密码时必须输入当前密码（后端同样校验）；
 * 短信或社交登录注册、从没设过密码的账号直接设置。忘记当前密码请走登录页的「找回密码」。
 */
export default function Page() {
  const describeError = useDescribeError("account");
  const t = useT("account");
  const [pw, setPw] = React.useState({ old: "", next: "", confirm: "" });
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const client = useQueryClient();
  const profileQ = useQuery({ queryKey: ["account-self"], queryFn: () => apiFetch<{ hasPassword?: boolean }>("/app/member/user/get") });
  // 读不到资料时按「已有密码」处理：多要一个当前密码，比把没密码的人卡住更安全
  const hasPassword: boolean | null = profileQ.data ? profileQ.data.hasPassword !== false : profileQ.isError ? true : null;

  useTabTitle(hasPassword === false ? t("pw.setTitle") : t("pw.title"));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null); setDone(false);
    if (pw.next.length < 8) { setError(t("pw.errShort")); return; }
    if (pw.next !== pw.confirm) { setError(t("pw.errMismatch")); return; }
    setBusy(true);
    try {
      await apiWrite("/app/member/user/update-password", "PUT", { oldPassword: pw.old, newPassword: pw.next });
      setPw({ old: "", next: "", confirm: "" }); setDone(true);
      void client.invalidateQueries({ queryKey: ["account-self"] });
    } catch (cause) { setError(describeError(cause)); } finally { setBusy(false); }
  }

  const title = hasPassword === false ? t("pw.setTitle") : t("pw.title");
  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title={title} description={hasPassword === false ? t("pw.descSet") : t("pw.descHas")} />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {done ? <Alert tone="info">{t("pw.done")}</Alert> : null}
      <Card className="max-w-xl">
        <CardContent className="py-5">
          <form onSubmit={submit} className="flex flex-col gap-3">
            {hasPassword !== false ? (
              <Field label={t("field.currentPassword")}><Input type="password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} autoComplete="current-password" /></Field>
            ) : null}
            <Field label={t("field.newPasswordMin")}><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
            <Field label={t("field.confirmPassword")}><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
            <div className="mt-1 flex items-center gap-2">
              <Button type="submit" disabled={busy || hasPassword === null || (hasPassword && !pw.old) || !pw.next || !pw.confirm}>{busy ? t("action.submitting") : t("action.save")}</Button>
              <KitLink href="/account/profile" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">{t("backToProfile")}</KitLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
