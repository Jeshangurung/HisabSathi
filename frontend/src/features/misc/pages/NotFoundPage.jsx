import { Link } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";


export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4 text-center">
      <div>
        <p className="text-sm font-bold uppercase text-sathi">404</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-zinc-500">The page you are looking for does not exist.</p>
        <Link className="mt-6 inline-block" to="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
