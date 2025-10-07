// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || "https://mutiny-api.mutinycomm.workers.dev";

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} @ ${path} ${text ? "- " + text : ""}`);
  }
  return (await res.json()) as T;
}

// ---- Revolt auth/session ----
export async function loginRevolt(username: string, password: string, remember = true) {
  return req<{ ok: boolean }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ id: username, password, remember }),
  });
}
export async function logoutRevolt() {
  await req<{ ok: boolean }>("/auth/logout", { method: "POST" });
}

// ---- Me / relationships ----
export type RevoltUser = { _id: string; username?: string; display_name?: string; avatar?: string };
export type RevoltServer = { _id: string; name: string; icon?: string };

export async function getMe() {
  return req<{ user: RevoltUser }>("/revolt/me");
}
export async function getFriends() {
  return req<{ friends: RevoltUser[] }>("/revolt/friends");
}
export async function getServers() {
  return req<{ servers: RevoltServer[] }>("/revolt/servers");
}

// ---- Channels / DMs ----
export type RevoltChannel = { _id: string; name?: string; channel_type: string };

export async function getServerChannels(serverId: string) {
  return req<{ channels: RevoltChannel[] }>(`/revolt/servers/${serverId}/channels`);
}
export async function openDMWithUser(userId: string) {
  return req<{ channel: RevoltChannel }>(`/revolt/users/${userId}/dm`, { method: "POST" });
}
export async function listDMs() {
  return req<{ channels: RevoltChannel[] }>(`/revolt/dms`);
}

// ---- Messages ----
export async function getMessages(channelId: string, limit = 50) {
  return req<any[]>(`/revolt/channels/${channelId}/messages?limit=${limit}`);
}
export async function sendMessage(channelId: string, content: string) {
  return req<any>(`/revolt/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// ---- Plugins (Registry + Installed) ----
export type PluginItem = {
  id: string;
  name: string;
  version: string;
  categories?: string[];
  capabilities?: string[];
  icon?: string;
  player?: any;
  accepts?: string[];
  parse?: { regex: string; group: number };
};

export async function searchPlugins(q = "", category = "") {
  const u = new URL(`${API_BASE}/registry/plugins`);
  if (q) u.searchParams.set("q", q);
  if (category) u.searchParams.set("category", category);
  const res = await fetch(u.toString(), { credentials: "include" });
  if (!res.ok) throw new Error(`Registry search failed (${res.status})`);
  return (await res.json()) as { items: PluginItem[] };
}
export async function installedPlugins() {
  return req<{ items: string[] }>("/plugins/installed");
}
export async function installPlugin(id: string) {
  return req<{ ok: boolean }>("/plugins/install", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
export async function uninstallPlugin(id: string) {
  return req<{ ok: boolean }>("/plugins/uninstall", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
export async function submitPlugin(manifestUrl: string) {
  return req<{ ok: boolean; received: string | null }>("/registry/submit", {
    method: "POST",
    body: JSON.stringify({ manifest_url: manifestUrl }),
  });
}

// Optional convenience object so UI can `import { plugins } from "@/api"`
export const plugins = {
  search: searchPlugins,
  installed: installedPlugins,
  install: installPlugin,
  uninstall: uninstallPlugin,
  submit: submitPlugin,
};
