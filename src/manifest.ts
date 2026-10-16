import { defineFrontModule } from "@neton/application-client-contract";

/** 账号中心（通用）：资料、密码、邮箱、手机。任何 Neton C 端产品都可装配。 */
export default defineFrontModule({
  id: "account",
  contractVersion: "1.0.0",
  locales: [
    { lang: "zh-CN", entry: "zh-CN" },
    { lang: "en-US", entry: "en-US" },
  ],
  pages: [
    { key: "account/profile/index", path: "/account/profile", entry: "profile", rendering: "client", title: "个人资料" },
    { key: "account/password/index", path: "/account/password", entry: "password", rendering: "client", title: "修改密码" },
    { key: "account/email/index", path: "/account/email", entry: "email", rendering: "client", title: "绑定邮箱" },
    { key: "account/mobile/index", path: "/account/mobile", entry: "mobile", rendering: "client", title: "绑定手机" },
  ],
});
