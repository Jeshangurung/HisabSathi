import { LogOut } from "lucide-react";

import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";


export default function Topbar() {
  const { logout, user } = useAuth();

  return (
    <header className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase text-zinc-400">Signed in as</p>
        <p className="text-sm font-bold text-ink">{user?.full_name || user?.username || "HisabSathi user"}</p>
      </div>
      <Button icon={LogOut} onClick={logout} variant="secondary">
        Logout
      </Button>
    </header>
  );
}
