import { Bell, CreditCard, Home, Landmark, LogOut, Receipt, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/settlements", label: "Settlements", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/profile", label: "Profile", icon: Receipt },
];


export default function AppLayout({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-mist">
      <aside className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white md:inset-x-auto md:bottom-auto md:left-0 md:top-0 md:h-screen md:w-72 md:border-r md:border-t-0">
        <div className="hidden px-6 py-7 md:block">
          <div className="text-2xl font-black text-ink">HisabSathi</div>
          <p className="mt-1 text-sm text-zinc-500">Shared money, calmly settled.</p>
        </div>
        <nav className="grid grid-cols-6 gap-1 p-2 md:block md:space-y-1 md:px-3">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex min-h-12 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold transition md:justify-start md:text-sm ${
                  isActive ? "bg-ink text-white" : "text-zinc-600 hover:bg-zinc-100"
                }`
              }
              key={item.href}
              to={item.href}
            >
              <item.icon size={18} />
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-3 right-3 hidden md:block">
          <Button className="w-full" icon={LogOut} onClick={logout} variant="secondary">
            Sign out
          </Button>
        </div>
      </aside>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:ml-72 md:px-8 md:pb-10 md:pt-8">
        {children}
      </main>
    </div>
  );
}
