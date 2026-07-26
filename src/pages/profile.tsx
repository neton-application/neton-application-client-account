"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Field, Input, PageHeader } from "@neton/application-client-kit";

interface MemberProfile {
  id: number; nickname?: string | null; avatar?: string | null;
  mobile?: string | null; email?: string | null;
}

/** 个人资料。通用模块：只依赖 member 的 app 接口，不含任何产品特有字段。 */
export default function Page() {
  const [profile, setProfile] = React.useState<MemberProfile | null>(null);
  const [nickname, setNickname] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const p = await apiFetch<MemberProfile>("/app/member/user/get");
      setProfile(p); setNickname(p.nickname ?? "");
    } catch (cause) { setError((cause as Error).message); }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  async function save() {
    setError(null); setSaved(false);
    try {
      await apiWrite("/app/member/user/update", "PUT", { nickname });
      setSaved(true); void load();
    } catch (cause) { setError((cause as Error).message); }
  }

  return (
    <div>
      <PageHeader eyebrow="ACCOUNT" title="个人资料" description="账号信息与昵称。" />
      {error ? <p role="alert">{error}</p> : null}
      {saved ? <p>已保存</p> : null}
      <Card>
        <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
        <CardContent>
          <Field label="昵称"><Input value={nickname} onChange={(e) => setNickname(e.target.value)} /></Field>
          <Field label="手机"><Input value={profile?.mobile ?? ""} readOnly /></Field>
          <Field label="邮箱"><Input value={profile?.email ?? ""} readOnly /></Field>
          <div style={{ marginTop: 12 }}><Button onClick={() => void save()}>保存</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
