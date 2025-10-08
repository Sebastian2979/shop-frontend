import { createSlice, createAsyncThunk, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import api from "./api/api";

const initialState = {
  items: [],
  syncing: false,
  lastSyncError: null,
};

// Thunk: ganzen Cart zum Backend spiegeln
export const syncCart = createAsyncThunk(
  "cart/sync",
  async (_arg, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().cart;
      const payload = { items: items.map(i => ({ product_id: i.id, quantity: i.quantity })) };
      payload.token = localStorage.getItem('cart_token');
      // API-Request
      const res = await api.post("/cart/sync", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: "Sync failed" });
    }
  }
);

export const syncCartOnLogin = createAsyncThunk(
  "cart/syncCartOnLogin",
  async (_arg, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/cart/syncCartOnLogin");

      const rows = Array.isArray(data) ? data : (data?.items ?? []);

      const items = rows
        .map((row) => {
          const p = row?.product ?? {};
          const id = p.id ?? row.product_id;
          const quantity = Number(row?.quantity ?? 0);

          // OHNE Cents: bevorzugt product.price (z. B. 8 oder 8.99)
          // Fallback, wenn nur unit_price_cents vorhanden: auf Euro umrechnen
          const price =
            p?.price != null
              ? Number(p.price)
              : row?.price != null
                ? Number(row.price)
                : row?.unit_price_cents != null
                  ? Number(row.unit_price_cents) / 100
                  : 0;

          return {
            id,
            name: p?.name ?? "Unbekannt",
            price,
            quantity,
          };
        })
        .filter((i) => i.id && i.quantity > 0);

      // optional direkt persistieren
      localStorage.setItem("cart", JSON.stringify(items));

      return items;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || "syncCartOnLogin failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    replaceCart(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    addItem(state, action) {
      const p = action.payload;
      const existing = state.items.find(i => i.id === p.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ id: p.id, name: p.name, price: p.price, quantity: 1 });
      }
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      const it = state.items.find(i => i.id === id);
      if (it) it.quantity = Math.max(1, Number(quantity) || 1);
    },
    removeItem(state, action) {
      const id = action.payload;
      const it = state.items.find(i => i.id === id);
      if (!it) return;
      it.quantity -= 1;
      if (it.quantity <= 0) {
        state.items = state.items.filter(i => i.id !== id);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(syncCart.pending, (s) => { s.syncing = true; s.lastSyncError = null; });
    b.addCase(syncCart.fulfilled, (s) => { s.syncing = false; });
    b.addCase(syncCart.rejected, (s, a) => { s.syncing = false; s.lastSyncError = a.payload?.message || "Sync failed"; });
    b.addCase(syncCartOnLogin.pending, (s) => { s.syncing = true; s.lastSyncError = null; });
    b.addCase(syncCartOnLogin.fulfilled, (s, a) => { s.syncing = false; s.items = Array.isArray(a.payload) ? a.payload : []; });
    b.addCase(syncCartOnLogin.rejected, (s, a) => { s.syncing = false; s.lastSyncError = a.payload?.message || "Sync on login failed"; });
  },
});

export const { replaceCart, addItem, setQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Listener: sync nach Änderungen
export const cartListener = createListenerMiddleware();
cartListener.startListening({
  matcher: isAnyOf(addItem, setQuantity, removeItem, clearCart, replaceCart),
  effect: async (_action, { dispatch, cancelActiveListeners, delay }) => {
    cancelActiveListeners();
    await delay(250);
    dispatch(syncCart());
  },
});
