import { Bell, CreditCard, Home, Landmark, Receipt, UserCircle, Users } from "lucide-react";
import { NavLink } from "react-router-dom";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/settlements", label: "Settlements", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/profile/payment", label: "Payments", icon: Receipt },
];


export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-zinc-200 bg-white md:block">
      <div className="px-6 py-7">
        <div className="text-2xl font-black text-ink">HisabSathi</div>
        <p className="mt-1 text-sm text-zinc-500">Shared money, settled cleanly.</p>
      </div>
      <nav className="space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-md px-4 text-sm font-semibold transition ${
                isActive ? "bg-ink text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-ink"
              }`
            }
            key={item.href}
            to={item.href}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
