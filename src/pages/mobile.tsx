"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { useQuery, useQueryClient } from "@neton/application-client-runtime/client-context";
import { useT } from "@neton/application-client-runtime/i18n";
import { useTabTitle } from "@neton/application-client-runtime/workspace";
import { Alert, Button, Card, CardContent, Field, Input, KitLink, PageHeader, Select } from "@neton/application-client-kit";

/** 后端 SmsScene.MEMBER_UPDATE_MOBILE —— 换绑手机的验证码场景号 */
const SCENE_UPDATE_MOBILE = 2;

const COUNTRY_CODES = ["+86", "+852", "+853", "+886", "+1", "+44", "+81", "+82", "+65"];

/**
 * 绑定 / 更换手机号：短信验证码发到**新**号码，填对才生效。后端要求 E.164（+8613812345678），
 * 这里拆成区号 + 号码两栏，免得用户自己拼。
 */
export default function Page() {
  const t = useT("account");
  const [cc, setCc] = React.useState("+86");
  const [number, setNumber] = React.useState("");
  const [code, setCode] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const client = useQueryClient();
  const profileQ = useQuery({ queryKey: ["account-self"], queryFn: () => apiFetch<{ mobile?: string | null }>("/app/member/user/get") });
  const current: string | null | undefined = profileQ.data ? profileQ.data.mobile ?? null : undefined;
  const load = () => client.invalidateQueries({ queryKey: ["account-self"] });
  useTabTitle(current ? t("mobile.titleChange") : t("mobile.titleBind"));
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const digits = number.replace(/\D/g, "");
  const e164 = `${cc}${digits}`;
  const numberOk = digits.length >= 5 && digits.length <= 14;

  async function send() {
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/send-sms-code", "POST", { mobile: e164, scene: SCENE_UPDATE_MOBILE });
      setSent(true); setCooldown(60); setNotice(t("mobile.sent", { number: `${cc} ${digits}` }));
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  async function bind(event: React.FormEvent) {
    event.preventDefault();
    setError(null); setNotice(null); setBusy(true);
    try {
      await apiWrite("/app/member/user/update-mobile", "PUT", { mobile: e164, smsCode: code.trim() });
      setNotice(t("mobile.bound")); setNumber(""); setCode(""); setSent(false); load();
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title={current ? t("mobile.titleChange") : t("mobile.titleBind")} description={t("mobile.description")} />
      {error ? <Alert tone="error">{error}</Alert> : null}
      {notice ? <Alert tone="info">{notice}</Alert> : null}
      <Card className="max-w-xl">
        <CardContent className="py-5">
          <form onSubmit={bind} className="flex flex-col gap-3">
            <Field label={t("field.currentMobile")}><Input value={current === undefined ? "" : current ?? t("value.notBound")} readOnly disabled /></Field>
            <Field label={current ? t("field.newMobile") : t("field.mobile")}>
              <div className="flex gap-2">
                <div className="w-40 shrink-0">
                  <Select value={cc} onChange={(e) => { setCc(e.target.value); setSent(false); }}>
                    {COUNTRY_CODES.map((code2) => <option key={code2} value={code2}>{t(`cc.${code2}`)}</option>)}
                  </Select>
                </div>
                <Input value={number} onChange={(e) => { setNumber(e.target.value); setSent(false); }} placeholder={t("mobile.numberPlaceholder")} inputMode="tel" autoComplete="tel-national" />
                <Button type="button" variant="secondary" onClick={() => void send()} disabled={busy || !numberOk || cooldown > 0 || e164 === current}>
                  {cooldown > 0 ? t("value.cooldown", { seconds: cooldown }) : sent ? t("action.resend") : t("action.sendCode")}
                </Button>
              </div>
            </Field>
            <Field label={t("field.code")}><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("mobile.smsCodePlaceholder")} inputMode="numeric" autoComplete="one-time-code" disabled={!sent} /></Field>
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
