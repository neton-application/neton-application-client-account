import { defineFrontModule } from "@neton/application-client-contract";

/** 用户中心（通用）：任何 Neton C 端产品都可装配。 */
export default defineFrontModule({
  id: "member",
  contractVersion: "1.0.0",
  pages: [
    { key: "member/profile/index", path: "/member/profile", entry: "profile", rendering: "client" },
  ],
});
