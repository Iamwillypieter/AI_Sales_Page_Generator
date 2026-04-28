import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LayoutGrid, Sparkles, LogOut, Plus } from "lucide-react";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 border-l-2 border-transparent text-sm font-medium tracking-wide hover:border-black hover:bg-white transition-colors";
  const linkActive = "border-black bg-white";

  return (
    <div className="min-h-screen flex bg-white">
      <aside
        className="hidden lg:flex flex-col w-64 border-r border-neutral-200 bg-[#F9F9F9]"
        data-testid="app-sidebar"
      >
        <div className="px-6 py-6 border-b border-neutral-200">
          <Link to="/" className="block group" data-testid="brand-link">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              [ai] sales craft
            </div>
            <div className="font-display text-2xl font-black tracking-tight mt-1">
              SalesCraft<span className="text-[#002FA7]">.</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            data-testid="nav-dashboard"
          >
            <LayoutGrid size={16} /> Dashboard
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            data-testid="nav-create"
          >
            <Sparkles size={16} /> New Sales Page
          </NavLink>
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">
            signed in
          </div>
          <div className="text-sm font-semibold truncate" data-testid="sidebar-user-name">
            {user?.name}
          </div>
          <div className="text-xs text-neutral-500 truncate mb-3" data-testid="sidebar-user-email">
            {user?.email}
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="w-full flex items-center justify-center gap-2 border border-black px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-colors"
            data-testid="logout-btn"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <Link to="/dashboard" className="font-display text-xl font-black tracking-tight">
            SalesCraft<span className="text-[#002FA7]">.</span>
          </Link>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-black text-white px-3 py-2 text-xs font-bold uppercase tracking-wider"
            data-testid="mobile-new-btn"
          >
            <Plus size={14} /> New
          </Link>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
