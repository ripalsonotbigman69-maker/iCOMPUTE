import { useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Trash2, Plus, Check } from "lucide-react";
import { useApp } from "@/state/AppState";
import { CATEGORIES } from "@/lib/categories";
import { formatPeso, formatDay } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { AddTransaction } from "./AddTransaction";
import { cn } from "@/lib/utils";
import type { CategoryKey } from "@/lib/types";

export default function Expenses() {
  const { transactions, totals, setTab } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryKey>>(new Set());

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => t.description.toLowerCase().includes(q.toLowerCase()));
    if (selectedCategories.size > 0) {
      result = result.filter((t) => selectedCategories.has(t.category));
    }
    return result;
  }, [transactions, q, selectedCategories]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((t) => {
      const key = t.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries()).sort(([a], [b]) => (a > b ? -1 : 1));
  }, [filtered]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24 bg-background">
      <header className="px-5 pt-3 pb-3 flex items-center gap-3">
        <button onClick={() => setTab("home")} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold leading-tight">Transactions</h1>
          <p className="text-[11px] text-muted-foreground">{transactions.length} transactions • <span className="text-primary">{formatPeso(totals.expense)}</span></p>
        </div>
      </header>

      <div className="px-5 flex gap-2">
        <div className="flex-1 flex items-center gap-2 h-11 px-3 rounded-xl bg-input border border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions..." className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9 text-sm" />
        </div>
        <div className="relative">
          <button 
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className={cn(
              "h-11 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-smooth",
              selectedCategories.size > 0
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-card border-border text-muted-foreground hover:text-primary"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-card z-50">
              <div className="p-3 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground">Categories</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {Object.entries(CATEGORIES).map(([key, category]) => {
                  const isSelected = selectedCategories.has(key as CategoryKey);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        const next = new Set(selectedCategories);
                        if (isSelected) {
                          next.delete(key as CategoryKey);
                        } else {
                          next.add(key as CategoryKey);
                        }
                        setSelectedCategories(next);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-primary/5 transition-smooth border-b border-border/50 last:border-b-0"
                    >
                      <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0", category.bg)}>
                        <category.icon className={cn("h-4 w-4", category.tone)} />
                      </span>
                      <span className="flex-1 text-left text-foreground">{category.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {selectedCategories.size > 0 && (
                <div className="p-3 border-t border-border">
                  <button
                    onClick={() => setSelectedCategories(new Set())}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 px-5 space-y-5">
        {grouped.map(([day, items]) => (
          <div key={day}>
            <p className="text-xs text-muted-foreground mb-2">{formatDay(day)}</p>
            <ul className="space-y-2">
              {items.map((t) => {
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
                    <p className={cn("text-sm font-semibold", t.kind === "income" ? "text-primary" : "text-foreground")}>
                      {t.kind === "income" ? "+" : "-"}{formatPeso(t.amount)}
                    </p>
                    <button className="h-8 w-8 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {grouped.length === 0 && <p className="text-center text-sm text-muted-foreground py-10">No transactions found.</p>}
      </div>

      <button onClick={() => setOpen(true)} aria-label="Add transaction" className="absolute bottom-20 right-5 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 transition-smooth">
        <Plus className="h-6 w-6" />
      </button>
      <AddTransaction open={open} onOpenChange={setOpen} />
    </div>
  );
}