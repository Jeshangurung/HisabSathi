import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/common/Button.jsx";


const highlights = [
  { title: "Group expenses", detail: "Split food, rent, trips, groceries, and office costs.", icon: WalletCards },
  { title: "Payment clarity", detail: "Track paid, received, pending, and confirmed money.", icon: ShieldCheck },
  { title: "Personal loans", detail: "Keep small loans visible before they become awkward.", icon: Sparkles },
];


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto grid min-h-screen max-w-7xl content-center gap-12 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase text-sathi">Nepal-focused expense clarity</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">HisabSathi</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            Split bills, track personal loans, upload payment proof, and settle shared money without confusion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button icon={ArrowRight}>Start now</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
          <div className="rounded-lg bg-ink p-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-zinc-400">Pokhara Trip</p>
                <p className="mt-1 text-3xl font-black">Rs. 18,420</p>
              </div>
              <span className="rounded-full bg-sathi px-3 py-1 text-xs font-bold text-white">Live</span>
            </div>
            <div className="mt-5 space-y-3">
              {["Dinner split", "Hotel advance", "Taxi from airport"].map((item, index) => (
                <div className="flex items-center justify-between rounded-lg bg-white/[0.08] p-4" key={item}>
                  <div>
                    <p className="font-semibold">{item}</p>
                    <p className="mt-1 text-sm text-zinc-400">{index + 2} friends involved</p>
                  </div>
                  <p className="font-bold">Rs. {(index + 1) * 1250}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 md:grid-cols-3 md:px-8">
        {highlights.map((item) => (
          <article className="rounded-lg bg-white p-5 shadow-soft" key={item.title}>
            <item.icon className="text-sathi" size={24} />
            <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{item.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
