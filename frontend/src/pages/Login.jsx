import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const r = await login(email.trim().toLowerCase(), password);
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
            // sales-page generator v1.0
          </div>
          <h2 className="font-display text-5xl font-black leading-[1.05]">
            Brief in.
            <br />
            <span className="text-[#4F7BFF]">Conversion-ready</span> page out.
          </h2>
          <p className="mt-6 max-w-md text-neutral-400 leading-relaxed">
            Stop staring at a blank Figma file. Drop in your product details and walk away with a
            structured, persuasive landing page in under 60 seconds.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <form
          onSubmit={submit}
          className="w-full max-w-sm border border-neutral-200 bg-white p-8 brutal-shadow-sm"
          data-testid="login-form"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">
            01 / sign in
          </div>
          <h1 className="font-display text-3xl font-black mt-2 mb-6">Welcome back.</h1>

          <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="login-email-input"
          />

          <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-300 px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            data-testid="login-password-input"
          />

          {error && (
            <div
              className="border border-[#FF3333] text-[#FF3333] px-3 py-2 text-sm mb-4"
              data-testid="login-error"
            >
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 font-bold uppercase tracking-[0.15em] text-sm hover:bg-[#002FA7] transition-colors disabled:opacity-60"
            data-testid="login-submit-btn"
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <div className="text-sm text-neutral-600 mt-6 text-center">
            No account?{" "}
            <Link to="/register" className="font-bold underline" data-testid="link-to-register">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
