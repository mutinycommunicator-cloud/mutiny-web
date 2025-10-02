const API = import.meta.env.VITE_API_BASE || "https://mutiny-api.mutinycomm.workers.dev";

type TokenStore = {
  get(): string | null;
  set(token: string, remember: boolean): void;
  clear(): void;
};

const tokenStore: TokenStore = {
  get() {
    return sessionStorage.getItem("mutiny_token") || localStorage.getItem("mutiny_token");
  },
  set(token, remember) {
    // no cookies: "remember me" => localStorage, else sessionStorage
    sessionStorage.removeItem("mutiny_token");
    localStorage.removeItem("mutiny_token");
    (remember ? localStorage : sessionStorage).setItem("mutiny_token", token);
  },
  clear() {
    sessionStorage.removeItem("mutiny_token");
    localStorage.removeItem("mutiny_token");
  }
};

function authHeaders() {
  const t = tokenStore.get();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export const api = {
  async revoltLogin(login: string, password: string, remember: boolean) {
    const r = await fetch(`${API}/auth/revolt/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password })
    });
    if (!r.ok) throw new Error("Login failed");
    const data = await r.json();
    const token = data.token || data?.result?.token || data?.session?.token; // tolerate shapes
    if (!token) throw new Error("No token from Revolt");
    tokenStore.set(token, remember);
    return true;
  },

  logout() {
    tokenStore.clear();
  },

  me() {
    return fetch(`${API}/revolt/me`, { headers: { ...authHeaders() } }).then(r => r.json());
  },

  listChannels() {
    return fetch(`${API}/revolt/channels`, { headers: { ...authHeaders() } }).then(r => r.json());
  },

  getMessages(channelId: string, limit = 50) {
    const q = new URLSearchParams({ limit: String(limit) });
    return fetch(`${API}/revolt/channels/${channelId}/messages?${q}`, { headers: { ...authHeaders() } }).then(r => r.json());
  },

  sendMessage(channelId: string, content: string) {
    return fetch(`${API}/revolt/channels/${channelId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ content })
    }).then(r => r.json());
  }
};

export const tokens = tokenStore; // export for UI convenience
