// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

let cartToken = localStorage.getItem("cart_token");
if (!cartToken) {
  cartToken =
    (globalThis.crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2));
      cartToken = cartToken.toString().slice(0, 32);
  localStorage.setItem("cart_token", cartToken);
}

api.interceptors.request.use((cfg) => {
  // optional: Bearer nur, wenn vorhanden – ist aber nicht nötig für Guest
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;

  cfg.headers.Accept = "application/json";
  cfg.headers["X-Requested-With"] = "XMLHttpRequest";
  cfg.headers["X-Cart-Token"] = cartToken;        // <<< wichtig

  // Content-Type bei FormData NICHT setzen!
  const isFD = typeof FormData !== "undefined" && cfg.data instanceof FormData;
  if (cfg.data && !isFD && !cfg.headers["Content-Type"]) {
    cfg.headers["Content-Type"] = "application/json";
  }
  return cfg;
});

export default api;
