const CURRENT_USER_KEY = "krishok-current-user-id";

export function getCurrentUserId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENT_USER_KEY, userId);
  window.dispatchEvent(new CustomEvent("krishok-user-changed", { detail: userId }));
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new CustomEvent("krishok-user-changed", { detail: null }));
}

export function getGuestId() {
  if (typeof window === "undefined") return "";
  const key = "krishok-guest-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const guestId = crypto.randomUUID();
  window.localStorage.setItem(key, guestId);
  return guestId;
}
