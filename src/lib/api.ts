// Simple API wrapper for Mutiny Worker
const API =
  (typeof window !== "undefined" && (window as any).MUTINY_API_BASE) ||
  import.meta.env.VITE_API_BASE ||
  "https://mutiny-api.mutinycomm.workers.dev";

async function j<T=any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(API + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers||{}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.headers.get("content-type")?.includes("application/json") ? res.json() : (await res.text() as any);
}

// ---- Auth (Revolt-style cookie session on Worker) ----
export async function loginRevolt(id: string, password: string) {
  return j("/auth/login", { method: "POST", body: JSON.stringify({ id, password }) });
}
export async function logout() {
  return j("/auth/logout", { method: "POST" });
}
export async function me() {
  return j("/auth/me"); // { ok, user?, plugins?, theme? }
}

// ---- Plugins / Registry ----
export async function registrySearch(q = "", category = "") {
  const u = new URL(API + "/registry/plugins");
  if (q) u.searchParams.set("q", q);
  if (category) u.searchParams.set("category", category);
  const res = await fetch(u.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("registry failed");
  return res.json(); // { items: [...] }
}
export async function registrySubmit(manifestUrl: string) {
  return j("/registry/submit", { method:"POST", body: JSON.stringify({ manifest_url: manifestUrl }) });
}
export async function pluginsInstalled() { return j("/plugins/installed"); }
export async function pluginInstall(id: string) { return j("/plugins/install", { method:"POST", body: JSON.stringify({ id }) }); }
export async function pluginUninstall(id: string) { return j("/plugins/uninstall", { method:"POST", body: JSON.stringify({ id }) }); }

// ---- Themes ----
export async function themesAvailable() { return j("/themes/available"); } // [{id,name,vars:{...}}]
export async function themeCurrent() { return j("/themes/current"); }     // { id }
export async function themeSet(id: string) { return j("/themes/current", { method:"PUT", body: JSON.stringify({ id }) }); }

// ---- Revolt-like servers / channels / discovery / moderation ----
export async function serversList() { return j("/revolt/servers"); }
export async function serverCreate(name: string) { return j("/revolt/servers", { method:"POST", body: JSON.stringify({ name }) }); }
export async function serverChannels(serverId: string) { return j(`/revolt/servers/${serverId}/channels`); }
export async function channelCreate(serverId: string, name: string) { return j(`/revolt/servers/${serverId}/channels`, { method:"POST", body: JSON.stringify({ name }) }); }

export async function discoveryList() { return j("/revolt/discovery"); }
export async function discoveryPublish(serverId: string) { return j("/revolt/discovery", { method:"POST", body: JSON.stringify({ serverId }) }); }

export async function modBan(serverId: string, userId: string, reason = "") {
  return j(`/revolt/servers/${serverId}/moderation/ban`, { method:"POST", body: JSON.stringify({ userId, reason }) });
}
export async function modKick(serverId: string, userId: string, reason = "") {
  return j(`/revolt/servers/${serverId}/moderation/kick`, { method:"POST", body: JSON.stringify({ userId, reason }) });
}

// ---- Bots (token issued by Worker; demo) ----
export async function botCreate(serverId: string, name: string) {
  return j(`/revolt/servers/${serverId}/bots`, { method:"POST", body: JSON.stringify({ name }) });
}

export { API };
