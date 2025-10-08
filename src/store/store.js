import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { replaceCart, cartListener } from "../cartSlice";
import { loadCart, saveCart, STORAGE_KEY } from "./storage";

// Beim Store-Start aus localStorage laden
const preloadedItems = loadCart();

export const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: { cart: { items: preloadedItems } },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(cartListener.middleware),
});

// Änderungen zurück in localStorage
let saveTimer = null;
store.subscribe(() => {
  const { items } = store.getState().cart;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveCart(items), 120);
});

// Cross-Tab-Sync (andere Tabs/Fenster)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      const items = e.newValue ? JSON.parse(e.newValue) : [];
      if (Array.isArray(items)) {
        store.dispatch(replaceCart(items));
      }
    } catch {
      // ignore
    }
  });
}