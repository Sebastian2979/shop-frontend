import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [serverMsg, setServerMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setServerMsg(null);
    setSubmitting(true);

    try {
      const result = await register(name, email, password);
      console.log("Erfolg:", result);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { status, data } = err.response || {};
        if (status === 422 && data?.errors) {
          setFormErrors(data.errors);
        } else {
          setServerMsg(data?.message || "Registrierung fehlgeschlagen.");
        }
      } else {
        setServerMsg("Netzwerk-/Client-Fehler.");
        console.error(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const errMsg = (key) => (formErrors[key] ? formErrors[key].join(" ") : null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 text-gray-800">
      <div className="p-8 sm:p-0 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {serverMsg && <p className="text-red-400 mb-4">{serverMsg}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errMsg("name") && <p className="text-red-400 text-sm mt-1">{errMsg("name")}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="E-Mail"
              className="w-full p-2 border rounded text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errMsg("email") && <p className="text-red-400 text-sm mt-1">{errMsg("email")}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Passwort"
              className="w-full p-2 border rounded text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errMsg("password") && <p className="text-red-400 text-sm mt-1">{errMsg("password")}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-60"
          >
            {submitting ? "Sende…" : "Register"}
          </button>
        </form>

        <Link to="/login" className="text-sm text-gray-600 hover:underline mt-4 block">
          zurück zum Login!
        </Link>
      </div>
    </div>
  );
}
