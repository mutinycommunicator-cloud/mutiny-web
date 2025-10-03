// Tiny client talking to your Worker
const API = import.meta.env.VITE_API_BASE || "https://mutiny-api.mutinycomm.workers.dev";

// token storage (no cookies)
const TOKEN_KEY = "mutiny_revolt_token";
function getToken() { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ""; }
function setToken(token: string, remember: boolean) {
  if (remember) localStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.setItem(TOKEN_KEY, token);
}
function clearToken() { localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY); }

async function req(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const t = getToken();
  if (t) headers.set("Authorization", "Bearer " + t);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const r = await fetch(API + path, { ...init, headers, credentials: "include" });
  if (!r.ok) throw new Error(`${r.status}`);
  const ct = r.headers.get("content-type") || "";
  return ct.includes("application/json") ? r.json() : r.text();
}

export const revolt = {
  async login(email: string, password: string, remember = true) {
    const data = await req("/revolt/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember, friendly_name: "Mutiny" })
    });
    if (!data?.token) throw new Error("No token returned");
    setToken(data.token, remember);
    return true;
  },
  async logout() {
    try { await req("/revolt/auth/logout", { method: "POST" }); } catch {}
    clearToken();
  },
  me: () => req("/revolt/users/me"),
  dms: () => req("/revolt/dms"),
  openDM: (userId: string) => req(`/revolt/dm/open/${encodeURIComponent(userId)}`, { method: "PUT" }),
  createGroup: (name: string, recipients: string[]) =>
    req("/revolt/groups/create", { method: "POST", body: JSON.stringify({ name, recipients }) }),
  createInvite: (channelId: string) =>
    req(`/revolt/channels/${encodeURIComponent(channelId)}/invites`, { method: "POST", body: "{}" }),
  joinInvite: (code: string) => req(`/revolt/invites/join/${encodeURIComponent(code)}`, { method: "POST" }),

  // friends
  sendFriendRequest: (username: string) =>
    req("/revolt/friends/request", { method: "POST", body: JSON.stringify({ username }) }),
  acceptFriend: (userId: string) => req(`/revolt/friends/accept/${encodeURIComponent(userId)}`, { method: "PUT" }),
  removeFriend: (userId: string) => req(`/revolt/friends/${encodeURIComponent(userId)}`, { method: "DELETE" }),
};
