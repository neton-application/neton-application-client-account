/** 模块 `account`（C 端）的 zh-CN 词条。命名空间 = 模块 id，key 在 zh / en 之间必须完全一致。 */
const messages: Record<string, string> = {
  // 通用动作
  "action.edit": "修改",
  "action.bind": "绑定",
  "action.set": "设置",
  "action.save": "保存",
  "action.cancel": "取消",
  "action.saving": "保存中…",
  "action.submitting": "提交中…",
  "action.confirmBind": "确认绑定",
  "action.sendCode": "发送验证码",
  "action.resend": "重新发送",
  "backToProfile": "返回个人资料",

  // 通用值
  "value.notSet": "未设置",
  "value.notBound": "未绑定",
  "value.passwordSet": "已设置",
  "value.cooldown": "{seconds} 秒后重发",

  // 个人资料
  "profile.title": "个人资料",
  "profile.description": "账号信息与安全设置",
  "profile.accountInfo": "账号信息",
  "profile.security": "安全设置",
  "profile.username": "用户名",
  "profile.nickname": "昵称",
  "profile.mobile": "手机号",
  "profile.email": "邮箱",
  "profile.password": "登录密码",
  "profile.usernameHintLocked": "用户名注册后不可修改",
  "profile.usernameHintNone": "短信注册的账号没有用户名，可用手机号登录",
  "profile.mobileHint": "用于短信登录与找回密码",
  "profile.emailHint": "用于接收通知与找回密码",
  "profile.passwordHintSet": "设置后可用用户名 + 密码登录",
  "profile.passwordHintHas": "建议定期更换，不要与其他网站使用同一密码",
  "profile.editNicknameTitle": "修改昵称",
  "profile.nicknameUpdated": "昵称已更新",

  // 密码
  "pw.title": "修改密码",
  "pw.setTitle": "设置密码",
  "pw.descHas": "需要先输入当前密码；忘记密码请在登录页找回",
  "pw.descSet": "设置后可用用户名 + 密码登录",
  "pw.errShort": "新密码至少 8 位",
  "pw.errMismatch": "两次输入的新密码不一致",
  "pw.done": "密码已更新，下次登录请使用新密码",
  "field.currentPassword": "当前密码",
  "field.newPasswordMin": "新密码（至少 8 位）",
  "field.confirmPassword": "确认新密码",

  // 邮箱
  "email.titleBind": "绑定邮箱",
  "email.titleChange": "更换邮箱",
  "email.description": "验证码会发到新邮箱，验证通过后才会生效",
  "email.sent": "验证码已发送到 {email}，5 分钟内有效",
  "email.bound": "邮箱已绑定",
  "field.currentEmail": "当前邮箱",
  "field.newEmail": "新邮箱",
  "field.emailAddress": "邮箱地址",
  "field.emailCodePlaceholder": "6 位数字",

  // 手机
  "mobile.titleBind": "绑定手机号",
  "mobile.titleChange": "更换手机号",
  "mobile.description": "验证码会发到新号码，验证通过后才会生效",
  "mobile.sent": "验证码已发送到 {number}",
  "mobile.bound": "手机号已绑定",
  "mobile.numberPlaceholder": "手机号码",
  "mobile.smsCodePlaceholder": "短信中的数字验证码",
  "field.currentMobile": "当前手机号",
  "field.newMobile": "新手机号",
  "field.mobile": "手机号",
  "field.code": "验证码",

  // 国际区号
  "cc.+86": "中国大陆 +86",
  "cc.+852": "中国香港 +852",
  "cc.+853": "中国澳门 +853",
  "cc.+886": "中国台湾 +886",
  "cc.+1": "美国 / 加拿大 +1",
  "cc.+44": "英国 +44",
  "cc.+81": "日本 +81",
  "cc.+82": "韩国 +82",
  "cc.+65": "新加坡 +65",
};

export default messages;
