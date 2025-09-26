import { API_BASE } from "../config";

export const RVLT = {
  async login(id: string, password: string) {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password })
    });
    if (!r.ok) throw new Error("Login failed");
    return true;
  },
  async logout() {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
  },
  async getMessages(channelId: string, limit = 50) {
    const r = await fetch(`${API_BASE}/revolt/channels/${channelId}/messages?limit=${limit}`, { credentials: "include" });
    if (!r.ok) throw new Error("Load failed");
    return r.json();
  },
  async sendMessage(channelId: string, content: string) {
    const r = await fetch(`${API_BASE}/revolt/channels/${channelId}/messages`, {
      method:"POST", credentials:"include",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ content })
    });
    if (!r.ok) throw new Error("Send failed");
    return r.json();
  },
  async react(channelId: string, messageId: string, emoji: string, on=true) {
    const url = `${API_BASE}/revolt/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`;
    const r = await fetch(url, { method: on ? "PUT" : "DELETE", credentials: "include", body: on ? "{}" : undefined });
    if (!r.ok) throw new Error("Reaction failed");
    return true;
  },
  async uploadAttachment(file: File) {
    const form = new FormData(); form.append("file", file);
    const r = await fetch(`${API_BASE}/revolt/upload/attachments`, { method: "POST", credentials: "include", body: form });
    if (!r.ok) throw new Error("Upload failed");
    return r.json();
  }
};
