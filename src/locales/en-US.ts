/** Module `account` (client) en-US catalog. Keys must exactly match zh-CN. */
const messages: Record<string, string> = {
  // Shared actions
  "action.edit": "Edit",
  "action.bind": "Bind",
  "action.set": "Set",
  "action.save": "Save",
  "action.cancel": "Cancel",
  "action.saving": "Saving…",
  "action.submitting": "Submitting…",
  "action.confirmBind": "Confirm binding",
  "action.sendCode": "Send code",
  "action.resend": "Resend",
  "backToProfile": "Back to profile",

  // Shared values
  "value.notSet": "Not set",
  "value.notBound": "Not bound",
  "value.passwordSet": "Set",
  "value.cooldown": "Resend in {seconds}s",

  // Profile
  "profile.title": "Profile",
  "profile.description": "Account info and security settings",
  "profile.accountInfo": "Account info",
  "profile.security": "Security settings",
  "profile.username": "Username",
  "profile.nickname": "Nickname",
  "profile.mobile": "Mobile",
  "profile.email": "Email",
  "profile.password": "Password",
  "profile.usernameHintLocked": "The username can't be changed after registration",
  "profile.usernameHintNone": "SMS-registered accounts have no username; sign in with your mobile number",
  "profile.mobileHint": "Used for SMS login and password recovery",
  "profile.emailHint": "Used to receive notifications and recover the password",
  "profile.passwordHintSet": "Once set, sign in with username + password",
  "profile.passwordHintHas": "Rotate it regularly; don't reuse this password on other sites",
  "profile.editNicknameTitle": "Edit nickname",
  "profile.nicknameUpdated": "Nickname updated",

  // Password
  "pw.title": "Change password",
  "pw.setTitle": "Set password",
  "pw.descHas": "Enter your current password first; forgot it? Recover it on the sign-in page",
  "pw.descSet": "Once set, sign in with username + password",
  "pw.errShort": "The new password must be at least 8 characters",
  "pw.errMismatch": "The two new passwords don't match",
  "pw.done": "Password updated; use the new password at next sign-in",
  "field.currentPassword": "Current password",
  "field.newPasswordMin": "New password (min 8 characters)",
  "field.confirmPassword": "Confirm new password",

  // Email
  "email.titleBind": "Bind email",
  "email.titleChange": "Change email",
  "email.description": "The code goes to the new email and only takes effect once verified",
  "email.sent": "Verification code sent to {email}; valid for 5 minutes",
  "email.bound": "Email bound",
  "field.currentEmail": "Current email",
  "field.newEmail": "New email",
  "field.emailAddress": "Email address",
  "field.emailCodePlaceholder": "6-digit code",

  // Mobile
  "mobile.titleBind": "Bind mobile number",
  "mobile.titleChange": "Change mobile number",
  "mobile.description": "The code goes to the new number and only takes effect once verified",
  "mobile.sent": "Verification code sent to {number}",
  "mobile.bound": "Mobile number bound",
  "mobile.numberPlaceholder": "Mobile number",
  "mobile.smsCodePlaceholder": "The numeric code from the SMS",
  "field.currentMobile": "Current mobile",
  "field.newMobile": "New mobile",
  "field.mobile": "Mobile",
  "field.code": "Verification code",

  // Country codes
  "cc.+86": "China Mainland +86",
  "cc.+852": "Hong Kong China +852",
  "cc.+853": "Macao China +853",
  "cc.+886": "Taiwan China +886",
  "cc.+1": "US / Canada +1",
  "cc.+44": "UK +44",
  "cc.+81": "Japan +81",
  "cc.+82": "South Korea +82",
  "cc.+65": "Singapore +65",
};

export default messages;
