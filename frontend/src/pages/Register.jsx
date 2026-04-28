import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await register(name.trim(), email.trim().toLowerCase(), password);
    setLoading(false);
    if (r.ok) navigate("/dashboard");
    else setError(r.error);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block bg-[#0A0A0A] scanline-bg p-12 relative overflow-hidden">
        <Link to="/" className="font-display text-2xl text-white font-black">
          SalesCraft<span className="text-[#4F7BFF]">.</span>
        </Link>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-400 mb-4">
            // join 1,200+ founders &amp; marketers
          </div>
          <h2 className="font-display text-5xl font-black leading-[1.05]">
            Stop writing copy.
            <br />
            <span className="text-[#4F7BFF]">Start shipping pages.</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <form
          onSubmit={submit}
          className="w-full max-w-sm border border-neutral-200 bg-white p-8 brutal-shadow-sm"
          data-testid="register-form"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">
            01 / create account
          </div>
          <h1 className="font-display text-3xl font-black mt-2 mb-6">Make it yours.</h1>

          <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-2">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-neutral-300 px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="register-name-input"
          />

          <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="register-email-input"
          />

          <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-300 px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="register-password-input"
          />

          {error && (
            <div
              className="border border-[#FF3333] text-[#FF3333] px-3 py-2 text-sm mb-4"
              data-testid="register-error"
            >
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 font-bold uppercase tracking-[0.15em] text-sm hover:bg-[#002FA7] transition-colors disabled:opacity-60"
            data-testid="register-submit-btn"
          >
            {loading ? "Creating…" : "Create account →"}
          </button>

          <div className="text-sm text-neutral-600 mt-6 text-center">
            Already have one?{" "}
            <Link to="/login" className="font-bold underline" data-testid="link-to-login">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
