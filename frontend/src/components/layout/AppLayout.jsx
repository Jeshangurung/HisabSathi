import MobileNav from "./MobileNav.jsx";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";


export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-mist">
      <Sidebar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:ml-72 md:px-8 md:pb-10 md:pt-8">
        <Topbar />
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
