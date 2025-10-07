// src/ui/PluginStore.tsx
import React from "react";
import { plugins } from "@/api";

export default function PluginStore() {
  const [items, setItems] = React.useState<any[]>([]);
  const [installed, setInstalled] = React.useState<string[]>([]);
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [submitUrl, setSubmitUrl] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function refresh() {
    try {
      setBusy(true);
      setErr(null);
      const [reg, ins] = await Promise.all([
        plugins.search(q, cat),
        plugins.installed(),
      ]);
      setItems(reg.items || []);
      setInstalled(ins.items || []);
    } catch (e: any) {
      setErr(e.message || "Failed to load plugins");
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(() => { refresh(); }, []);

  async function onInstall(id: string) {
    setBusy(true);
    try {
      await plugins.install(id);
      await refresh();
      alert("Installed.");
    } catch (e: any) {
      alert(e.message || "Install failed");
    } finally {
      setBusy(false);
    }
  }

  async function onUninstall(id: string) {
    setBusy(true);
    try {
      await plugins.uninstall(id);
      await refresh();
      alert("Uninstalled.");
    } catch (e: any) {
      alert(e.message || "Uninstall failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit() {
    if (!submitUrl.trim()) return;
    setBusy(true);
    try {
      await plugins.submit(submitUrl.trim());
      setSubmitUrl("");
      alert("Submitted! An admin must approve it before it appears.");
    } catch (e: any) {
      alert(e.message || "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 10,
    background: "#0b0c10",
    border: "1px solid #23262e",
    color: "#e7ebf0",
  };

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Plugin Store</h3>

      {err && <div style={{ color: "#f66", marginBottom: 8 }}>{err}</div>}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={inputStyle}
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={inputStyle}
        >
          <option value="">All categories</option>
          <option value="overlay">Overlay</option>
          <option value="scheduling">Scheduling</option>
          <option value="chat">Chat</option>
          <option value="analytics">Analytics</option>
          <option value="media">Media</option>
          <option value="misc">Misc</option>
        </select>
        <button onClick={refresh} disabled={busy}>Search</button>
      </div>

      <div style={{
        border: "1px solid #23262e",
        borderRadius: 16,
        padding: 12,
        marginBottom: 16
      }}>
        <b>Submit plugin</b>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            placeholder="https://.../mutiny-plugin.json"
            value={submitUrl}
            onChange={(e) => setSubmitUrl(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={onSubmit} disabled={busy} style={{ padding: "8px 10px", borderRadius: 10 }}>
            {busy ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
        {items.map((d) => {
          const isInstalled = installed.includes(d.id);
          return (
            <div key={d.id} style={{ border: "1px solid #23262e", borderRadius: 16, padding: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {d.icon && (
                  <img src={d.icon} alt="" width="28" height="28" style={{ borderRadius: 6 }} />
                )}
                <div>
                  <div style={{ fontWeight: 700 }}>{d.name}</div>
                  <div style={{ opacity: 0.7, fontSize: 12 }}>
                    {d.id} · v{d.version}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 8, opacity: 0.8, fontSize: 12 }}>
                {(d.categories || []).join(" · ") || "misc"}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {!isInstalled ? (
                  <button
                    onClick={() => onInstall(d.id)}
                    disabled={busy}
                    style={{ padding: "6px 10px", borderRadius: 10 }}
                  >
                    Install
                  </button>
                ) : (
                  <button
                    onClick={() => onUninstall(d.id)}
                    disabled={busy}
                    style={{ padding: "6px 10px", borderRadius: 10 }}
                  >
                    Uninstall
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
