"use client";

import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-client-runtime/client";
import { useQuery, useQueryClient } from "@neton/application-client-runtime/client-context";
import { maskEmail, maskMobile, memberDisplayName, memberInitial } from "@neton/application-client-runtime/types";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle, Drawer, Field, Input, KitLink, PageHeader, UserIcon } from "@neton/application-client-kit";

interface MemberProfile {
  id: number; username?: string | null; nickname?: string | null; avatar?: string | null;
  mobile?: string | null; email?: string | null; hasPassword?: boolean;
}

const actionClass =
  "inline-flex h-8 items-center rounded-md border border-[var(--border)] px-3 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)]";

function Row({ label, value, hint, action }: { label: string; value: React.ReactNode; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-b border-[var(--border)] py-3.5 last:border-b-0">
      <div className="w-24 shrink-0 text-sm text-[var(--muted-foreground)]">{label}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-[var(--foreground)]">{value}</div>
        {hint ? <div className="mt-0.5 text-xs text-[var(--muted-foreground)]">{hint}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * 个人资料：只读展示 + 各项单独的修改入口。
 *
 * 用户名不可改；手机、邮箱要走验证码，所以各自是独立页面（mobile.tsx / email.tsx），
 * 密码在 password.tsx。这里唯一能就地改的是昵称，也是在抽屉里改、不直接暴露输入框。
 */
export default function Page() {
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [editingNickname, setEditingNickname] = React.useState(false);
  const [nickname, setNickname] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  // useQuery 而不是 effect 里取数：工作区切回页签会重挂 effect，那样每次切换都整页重拉。
  // 「account-self」与邮箱 / 手机 / 密码页共用，那几页改完失效它，回到这里就是新值。
  const client = useQueryClient();
  const profileQ = useQuery({ queryKey: ["account-self"], queryFn: () => apiFetch<MemberProfile>("/app/member/user/get") });
  const profile = profileQ.data ?? null;
  const load = () => client.invalidateQueries({ queryKey: ["account-self"] });

  async function saveNickname() {
    setSaving(true); setError(null); setNotice(null);
    try {
      await apiWrite("/app/member/user/update-nickname", "PUT", { nickname: nickname.trim() });
      setEditingNickname(false); setNotice("昵称已更新"); void load();
    } catch (cause) { setError((cause as Error).message); } finally { setSaving(false); }
  }

  const display = profile ? memberDisplayName(profile) : "";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader eyebrow="ACCOUNT" title="个人资料" description="账号信息与安全设置" />
      {error ?? profileQ.error ? <Alert tone="error">{error ?? (profileQ.error as Error).message}</Alert> : null}
      {notice ? <Alert tone="info">{notice}</Alert> : null}

      <Card>
        <CardContent className="flex items-center gap-4 py-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--foreground)] text-xl font-semibold text-[var(--background)]">
            {(profile && memberInitial(profile)) || <UserIcon size={24} />}
          </span>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-[var(--foreground)]">{display || "—"}</div>
            <div className="mt-0.5 truncate text-sm text-[var(--muted-foreground)]">{profile?.username ? `@${profile.username}` : ""}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>账号信息</CardTitle></CardHeader>
        <CardContent>
          <Row
            label="用户名"
            value={profile?.username || "未设置"}
            hint={profile?.username ? "用户名注册后不可修改" : "短信注册的账号没有用户名，可用手机号登录"}
          />
          <Row
            label="昵称"
            value={profile?.nickname || "未设置"}
            action={<button type="button" className={actionClass} onClick={() => { setNickname(profile?.nickname ?? ""); setEditingNickname(true); }}>修改</button>}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>安全设置</CardTitle></CardHeader>
        <CardContent>
          <Row
            label="手机号"
            value={profile?.mobile ? maskMobile(profile.mobile) : "未绑定"}
            hint="用于短信登录与找回密码"
            action={<KitLink href="/account/mobile" className={actionClass}>{profile?.mobile ? "修改" : "绑定"}</KitLink>}
          />
          <Row
            label="邮箱"
            value={profile?.email ? maskEmail(profile.email) : "未绑定"}
            hint="用于接收通知与找回密码"
            action={<KitLink href="/account/email" className={actionClass}>{profile?.email ? "修改" : "绑定"}</KitLink>}
          />
          <Row
            label="登录密码"
            value={profile?.hasPassword === false ? "未设置" : "已设置"}
            hint={profile?.hasPassword === false ? "设置后可用用户名 + 密码登录" : "建议定期更换，不要与其他网站使用同一密码"}
            action={<KitLink href="/account/password" className={actionClass}>{profile?.hasPassword === false ? "设置" : "修改"}</KitLink>}
          />
        </CardContent>
      </Card>

      <Drawer
        open={editingNickname}
        onClose={() => setEditingNickname(false)}
        title="修改昵称"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingNickname(false)}>取消</Button>
            <Button onClick={() => void saveNickname()} disabled={saving || !nickname.trim()}>{saving ? "保存中…" : "保存"}</Button>
          </>
        }
      >
        <Field label="昵称"><Input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={32} autoFocus /></Field>
      </Drawer>
    </div>
  );
}
