import { API_BASE } from "../config";
export type RegistryItem = {
  id:string; name:string; version:string;
  categories:string[]; runtime:"ui"|"webhook";
  entry:string; manifest_url:string; permissions:string[];
  author?: any; homepage?: string; icon?: string;
  status?: "draft"|"approved"|"rejected";
};
export const PluginsAPI = {
  async search(q="",category=""){
    const u = new URL(`${API_BASE}/registry/plugins`);
    if(q) u.searchParams.set("q", q);
    if(category) u.searchParams.set("category", category);
    const r = await fetch(u, { credentials:"include" }); return r.json();
  },
  async installed(){
    const r = await fetch(`${API_BASE}/plugins/installed`, { credentials:"include" }); return r.json();
  },
  async install(id:string){
    await fetch(`${API_BASE}/plugins/install`, { method:"POST", credentials:"include",
      headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ id }) });
  },
  async uninstall(id:string){
    await fetch(`${API_BASE}/plugins/uninstall`, { method:"POST", credentials:"include",
      headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ id }) });
  },
  async submit(manifest_url:string){
    const r = await fetch(`${API_BASE}/registry/submit`, { method:"POST", credentials:"include",
      headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ manifest_url }) });
    return r.json();
  }
};
