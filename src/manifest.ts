import { defineFrontModule } from "@neton/application-client-contract";

/** 用户中心（通用）：任何 Neton C 端产品都可装配。 */
export default defineFrontModule({
  id: "member",
  contractVersion: "1.0.0",
  pages: [
    { key: "member/profile/index", path: "/member/profile", entry: "profile", rendering: "client", title: "个人资料" },
    { key: "member/password/index", path: "/member/password", entry: "password", rendering: "client", title: "修改密码" },
    { key: "member/email/index", path: "/member/email", entry: "email", rendering: "client", title: "绑定邮箱" },
    { key: "member/mobile/index", path: "/member/mobile", entry: "mobile", rendering: "client", title: "绑定手机" },
  ],
});
