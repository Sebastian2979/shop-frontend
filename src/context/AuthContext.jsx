// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from "../api/api";
import { store } from "../store/store";
import { syncCartOnLogin, clearCart } from "@/cartSlice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // Boot aus localStorage
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      if (u && t) {
        const parsed = JSON.parse(u);
        setUser(parsed);
        setToken(t);
        api.defaults.headers.common.Authorization = `Bearer ${t}`;
      }
    } catch (e) {
      console.error("Auth boot error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  //Register-Funktion
  const register = async (name, email, password) => {
      const { data } = await api.post("/register", { name, email, password });
      const { user: userData, token } = data;
      // Zustand setzen
      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      return data;
  };

  // Login-Funktion und Überprüfung ob Warenkorb vorhanden und synchronisieren
  const login = async (email, password) => {
      const { data } = await api.post('/login', { email, password })
      const { user: userData, token } = data;
      // Zustand setzen
      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      // Nach Login: Warenkorb synchronisieren
      await store.dispatch(syncCartOnLogin());
      return data;
  };

  // Logout-Funktion
  const logout = async () => {
    try {
      await api.post('/logout');
      store.dispatch(clearCart());
    } catch (e) {
      console.warn("Logout fehlgeschlagen:", e?.message);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      navigate('/');
    }
  };

  

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);