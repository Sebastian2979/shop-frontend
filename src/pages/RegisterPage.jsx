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
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-teal-300">
      <div className="p-8 sm:p-0 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {serverMsg && <p className="text-red-400 mb-4">{serverMsg}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded text-teal-300"
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
              className="w-full p-2 border rounded text-teal-300"
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
              className="w-full p-2 border rounded text-teal-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errMsg("password") && <p className="text-red-400 text-sm mt-1">{errMsg("password")}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 disabled:opacity-60"
          >
            {submitting ? "Sende…" : "Register"}
          </button>
        </form>

        <Link to="/" className="text-sm text-teal-400 hover:underline mt-4 block">
          zurück
        </Link>
      </div>
    </div>
  );
}
