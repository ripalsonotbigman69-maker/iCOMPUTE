import { useState } from "react";
import { Eye, EyeOff, Plus, ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import { useApp } from "@/state/AppState";
import { CATEGORIES } from "@/lib/categories";
import { formatPeso, formatPesoCompact } from "@/lib/format";
import { AddTransaction } from "./AddTransaction";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, balance, totals, transactions, setTab } = useApp();
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);

  const expByCat = Object.entries(
    transactions
      .filter((t) => t.kind === "expense")
      .reduce<Record<string, number>>((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {})
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const expTotal = totals.expense || 1;

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24 bg-background">
      <header className="px-6 pt-3 pb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground">Welcome</p>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <button onClick={() => setHide(!hide)} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground">
          {hide ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </header>

      <section className="px-5">
        <div className="rounded-3xl p-5 bg-gradient-card border border-primary/20 shadow-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <p className="text-xs text-muted-foreground">Available Balance</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {hide ? "₱•••••" : formatPeso(balance)}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-secondary/60 border border-border p-3 flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center">
                <ArrowDown className="h-4 w-4 text-primary" />
              </span>
              <div>
                <p className="text-[10px] text-muted-foreground">Income</p>
                <p className="text-sm font-semibold">{hide ? "₱•••" : formatPesoCompact(totals.income)}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-secondary/60 border border-border p-3 flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-destructive/15 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 text-destructive" />
              </span>
              <div>
                <p className="text-[10px] text-muted-foreground">Expense</p>
                <p className="text-sm font-semibold">{hide ? "₱•••" : formatPeso(totals.expense)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-3">
          {expByCat.map(([k, v]) => {
            const c = CATEGORIES[k as keyof typeof CATEGORIES]; const I = c.icon;
            const pct = Math.round((v / expTotal) * 100);
            const ringColors: Record<string, string> = { food: "stroke-orange-400", shopping: "stroke-pink-400", transport: "stroke-sky-400", entertainment: "stroke-violet-400", bills: "stroke-yellow-400", healthcare: "stroke-rose-400", education: "stroke-blue-400", others: "stroke-emerald-400" };
            return (
              <div key={k} className="rounded-2xl bg-card border border-border p-3 flex flex-col items-center gap-2">
                <div className="relative h-14 w-14">
                  <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                    <circle cx="18" cy="18" r="15" className="stroke-muted fill-none" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" className={cn("fill-none", ringColors[k] ?? "stroke-primary")} strokeWidth="3" strokeDasharray={`${pct} 100`} strokeLinecap="round" pathLength={100} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold">{pct}%</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <I className={cn("h-3 w-3", c.tone)} /> {c.label.split(" ")[0]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">My Transactions</h2>
          <button onClick={() => setTab("expenses")} className="text-xs text-primary flex items-center gap-0.5">See All <ChevronRight className="h-3 w-3" /></button>
        </div>
        <ul className="mt-3 space-y-2">
          {transactions.slice(0, 4).map((t) => {
            const c = CATEGORIES[t.category]; const I = c.icon;
            return (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border px-3 py-2.5">
                <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.bg)}>
                  <I className={cn("h-5 w-5", c.tone)} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <p className="text-[11px] text-muted-foreground">{c.label}</p>
                </div>
                <p className={cn("text-sm font-semibold", t.kind === "income" ? "text-primary" : "text-destructive")}>
                  {t.kind === "income" ? "+" : "-"}{formatPeso(t.amount)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <button onClick={() => setOpen(true)} aria-label="Add transaction" className="absolute bottom-20 right-5 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 transition-smooth">
        <Plus className="h-6 w-6" />
      </button>
      <AddTransaction open={open} onOpenChange={setOpen} />
    </div>
  );
}