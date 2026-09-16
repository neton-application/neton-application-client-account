"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Field, Input, PageHeader } from "@neton/application-client-kit";

interface MemberProfile {
  id: number; username?: string | null; nickname?: string | null; avatar?: string | null;
  mobile?: string | null; email?: string | null;
}
interface MyInviteCode { code: string; usedCount: number }

/** 个人资料、改密码、邀请。通用模块：只依赖 member 的 app 接口，不含任何产品特有字段。 */
export default function Page() {
  const [profile, setProfile] = React.useState<MemberProfile | null>(null);
  const [nickname, setNickname] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [pw, setPw] = React.useState({ old: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = React.useState<string | null>(null);
  const [pwBusy, setPwBusy] = React.useState(false);
  const [invite, setInvite] = React.useState<MyInviteCode | null>(null);
  const [copied, setCopied] = React.useState(false);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const p = await apiFetch<MemberProfile>("/app/member/user/get");
      setProfile(p); setNickname(p.nickname ?? "");
    } catch (cause) { setError((cause as Error).message); }
  }, []);

  React.useEffect(() => { void load(); }, [load]);
  React.useEffect(() => {
    let alive = true;
    apiFetch<MyInviteCode>("/app/member/invite-code/mine").then((c) => { if (alive) setInvite(c); }).catch(() => { /* 未启用邀请功能时忽略 */ });
    return () => { alive = false; };
  }, []);

  async function save() {
    setError(null); setSaved(false);
    try {
      await apiWrite("/app/member/user/update", "PUT", { nickname });
      setSaved(true); void load();
    } catch (cause) { setError((cause as Error).message); }
  }

  async function changePassword() {
    setPwMsg(null);
    if (pw.next.length < 8) { setPwMsg("新密码至少 8 位"); return; }
    if (pw.next !== pw.confirm) { setPwMsg("两次输入的新密码不一致"); return; }
    setPwBusy(true);
    try {
      await apiWrite("/app/member/user/update-password", "PUT", { oldPassword: pw.old, newPassword: pw.next });
      setPw({ old: "", next: "", confirm: "" }); setPwMsg("密码已更新");
    } catch (cause) { setPwMsg((cause as Error).message); } finally { setPwBusy(false); }
  }

  const inviteLink = invite && typeof window !== "undefined" ? `${window.location.origin}/register?invite=${encodeURIComponent(invite.code)}` : "";

  return (
    <div>
      <PageHeader eyebrow="ACCOUNT" title="个人资料" description="账号信息、密码与邀请。" />
      {error ? <p role="alert">{error}</p> : null}
      {saved ? <p>已保存</p> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
        <Card>
          <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
          <CardContent>
            <Field label="用户名"><Input value={profile?.username ?? ""} readOnly /></Field>
            <Field label="昵称"><Input value={nickname} onChange={(e) => setNickname(e.target.value)} /></Field>
            <Field label="手机"><Input value={profile?.mobile ?? ""} readOnly /></Field>
            <div style={{ marginTop: 12 }}><Button onClick={() => void save()}>保存</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>修改密码</CardTitle></CardHeader>
          <CardContent>
            <Field label="当前密码"><Input type="password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} autoComplete="current-password" /></Field>
            <Field label="新密码（至少 8 位）"><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></Field>
            <Field label="确认新密码"><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" /></Field>
            {pwMsg ? <p style={{ fontSize: 13, margin: "6px 0 0" }}>{pwMsg}</p> : null}
            <div style={{ marginTop: 12 }}><Button onClick={() => void changePassword()} disabled={pwBusy || !pw.old || !pw.next}>{pwBusy ? "提交中…" : "更新密码"}</Button></div>
          </CardContent>
        </Card>
      </div>
      {invite ? (
        <Card style={{ marginTop: 12 }}>
          <CardHeader><CardTitle>邀请好友</CardTitle></CardHeader>
          <CardContent>
            <p style={{ margin: "0 0 6px", fontSize: 13 }}>我的邀请码：<code>{invite.code}</code>，已邀请 {invite.usedCount} 人。好友注册时填写邀请码，或直接用下面的链接注册。</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Input value={inviteLink} readOnly />
              <Button variant="secondary" onClick={() => { void navigator.clipboard?.writeText(inviteLink); setCopied(true); }}>{copied ? "已复制" : "复制链接"}</Button>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted-foreground)" }}>是否有邀请奖励、奖励多少由平台设定，以实际到账为准。</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
