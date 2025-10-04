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
  // friends = users you have a relationship with (accepted)
  return req<{ friends: RevoltUser[] }>("/revolt/friends");
}
export async function getServers() {
  // servers you’re a member of
  return req<{ servers: RevoltServer[] }>("/revolt/servers");
}

// ---- Channels / DMs ----
export type RevoltChannel = { _id: string; name?: string; channel_type: string };

export async function getServerChannels(serverId: string) {
  return req<{ channels: RevoltChannel[] }>(`/revolt/servers/${serverId}/channels`);
}

export async function openDMWithUser(userId: string) {
  // Creates/returns an existing DM channel with that user
  return req<{ channel: RevoltChannel }>(`/revolt/users/${userId}/dm`, { method: "POST" });
}

export async function listDMs() {
  return req<{ channels: RevoltChannel[] }>(`/revolt/dms`);
}

// ---- Messages (your existing ones keep working) ----
export async function getMessages(channelId: string, limit = 50) {
  return req<any[]>(`/revolt/channels/${channelId}/messages?limit=${limit}`);
}
export async function sendMessage(channelId: string, content: string) {
  return req<any>(`/revolt/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
