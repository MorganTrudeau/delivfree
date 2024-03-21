import { translate } from "app/i18n";

export function firebaseAuthErrorToMessage(error: unknown) {
  // @ts-ignore
  if (!(error && error.code)) {
    return translate("errors.common");
  }
  // @ts-ignore
  switch (error.code) {
    case "auth/user-not-found":
      return translate("errors.auth_user_not_found");
    case "auth/wrong-password":
      return translate("errors.auth_wrong_password");
    case "auth/invalid-email":
      return translate("errors.auth_invalid_email");
    case "auth/weak-password":
      return translate("errors.auth_weak_password");
    case "auth/email-already-in-use":
      return translate("errors.auth_email_already_in_use");
    case "auth/requires-recent-login":
      return translate("errors.auth_requires-recent-login");
    case "auth/network-request-failed":
      return translate("errors.auth_network-request-failed");
    case "auth/provider-already-linked":
      return translate("errors.already-request-failed");
    default:
      return translate("errors.common");
  }
}
