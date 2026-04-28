import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="auth-loading">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-500">
          Authenticating<span className="terminal-cursor"></span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
