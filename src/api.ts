// src/api.ts
export const API_BASE = (import.meta.env.VITE_API_BASE || "https://mutiny-api.mutinycomm.workers.dev").replace(/\/+$/,"");

export type Msg = { _id: string; author: string; content: string };

async function json<T>(res: Response) {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export const revolt = {
  async login(id: string, password: string) {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    if (!r.ok) throw new Error("Login failed");
    return true;
  },
  async logout() {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
  },
  async channelsMine() {
    // If your Worker adds a real endpoint later, switch to it.
    // For now, persist the user's last used channels in localStorage as a fallback.
    const raw = localStorage.getItem("mutiny.channels") || "[]";
    return JSON.parse(raw) as { id: string; name: string }[];
  },
  async rememberChannel(id: string, name: string) {
    const list = await revolt.channelsMine();
    if (!list.find(c => c.id === id)) {
      list.push({ id, name });
      localStorage.setItem("mutiny.channels", JSON.stringify(list));
    }
  },
  async getMessages(channelId: string, limit = 50) {
    const r = await fetch(`${API_BASE}/revolt/channels/${channelId}/messages?limit=${limit}`, { credentials: "include" });
    return json<Msg[]>(r);
  },
  async sendMessage(channelId: string, content: string) {
    const r = await fetch(`${API_BASE}/revolt/channels/${channelId}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return json<Msg>(r);
  },
};

export const plugins = {
  async search(q = "", category = "") {
    const url = new URL(`${API_BASE}/registry/plugins`);
    if (q) url.searchParams.set("q", q);
    if (category) url.searchParams.set("category", category);
    const r = await fetch(url, { credentials: "include" });
    return json<{ items: any[] }>(r);
  },
};
