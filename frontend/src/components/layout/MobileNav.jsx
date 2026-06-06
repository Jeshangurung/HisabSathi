import { Bell, CreditCard, Home, Landmark, Users } from "lucide-react";
import { NavLink } from "react-router-dom";


const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/settlements", label: "Settle", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/reminders", label: "Alerts", icon: Bell },
];


export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-zinc-200 bg-white px-2 py-2 md:hidden">
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold ${
              isActive ? "bg-ink text-white" : "text-zinc-500"
            }`
          }
          key={item.href}
          to={item.href}
        >
          <item.icon size={17} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
