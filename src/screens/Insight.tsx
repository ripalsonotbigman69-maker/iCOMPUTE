import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useApp } from "@/state/AppState";
import { CATEGORIES } from "@/lib/categories";
import { formatPeso } from "@/lib/format";
import { AddTransaction } from "./AddTransaction";
import { cn } from "@/lib/utils";

type Range = "Daily" | "Weekly" | "Monthly" | "Yearly";

export default function Insight() {
  const { transactions, setTab } = useApp();
  const [range, setRange] = useState<Range>("Monthly");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [open, setOpen] = useState(false);

  const { points, total, count, byCat, predictedExpense, predictionSummary, predictedCategory, availableYears } = useMemo(() => {
    const now = new Date();
    const currentYear = new Date().getFullYear();
    const expenseTransactions = transactions.filter((tx) => tx.kind === "expense");
    const yearsSet = new Set<number>([currentYear]);
    expenseTransactions.forEach((tx) => yearsSet.add(new Date(tx.date).getFullYear()));
    const availableYears = Array.from(yearsSet).sort((a, b) => b - a);

    const buckets: { label: string; value: number }[] = [];
    let bucketCount = 0, msPerBucket = 0;
    if (range === "Daily") { bucketCount = 24; msPerBucket = 3600 * 1000; }
    if (range === "Weekly") { bucketCount = 7; msPerBucket = 24 * 3600 * 1000; }
    if (range === "Monthly") { bucketCount = 30; msPerBucket = 24 * 3600 * 1000; }
    if (range === "Yearly") { bucketCount = 12; }

    if (range === "Yearly") {
      for (let month = 0; month < 12; month++) {
        const t = new Date(selectedYear, month, 1);
        buckets.push({ label: t.toLocaleDateString("en-US", { month: "short" }), value: 0 });
      }
    } else {
      for (let i = bucketCount - 1; i >= 0; i--) {
        const t = new Date(now.getTime() - i * msPerBucket);
        const label =
          range === "Daily" ? `${t.getHours()}h` :
          range === "Weekly" ? t.toLocaleDateString("en-US", { weekday: "short" }) :
          t.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        buckets.push({ label, value: 0 });
      }
    }

    let total = 0, count = 0;
    const byCat: Record<string, number> = {};
    expenseTransactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      if (range === "Yearly") {
        if (txDate.getFullYear() !== selectedYear) return;
        buckets[txDate.getMonth()].value += tx.amount;
        total += tx.amount; count++;
        byCat[tx.category] = (byCat[tx.category] || 0) + tx.amount;
        return;
      }
      const diff = now.getTime() - txDate.getTime();
      const idx = bucketCount - 1 - Math.floor(diff / msPerBucket);
      if (idx >= 0 && idx < bucketCount) {
        buckets[idx].value += tx.amount;
        total += tx.amount; count++;
        byCat[tx.category] = (byCat[tx.category] || 0) + tx.amount;
      }
    });

    const lastSixMonths: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      lastSixMonths.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`);
    }

    const monthlyTotalsMap = expenseTransactions.reduce((acc, tx) => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      if (monthStart >= cutoff) {
        acc[key] = (acc[key] || 0) + tx.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const monthlyTotals = lastSixMonths.map((key) => monthlyTotalsMap[key] || 0);
    const monthsCount = monthlyTotals.length;
    const xMean = (monthsCount - 1) / 2;
    const yMean = monthlyTotals.reduce((sum, v) => sum + v, 0) / monthsCount;
    const varianceX = monthlyTotals.reduce((sum, _, i) => sum + (i - xMean) ** 2, 0);
    const covariance = monthlyTotals.reduce((sum, value, i) => sum + (i - xMean) * (value - yMean), 0);
    const slope = varianceX ? covariance / varianceX : 0;
    const intercept = yMean - slope * xMean;

    const predictedExpense = Math.max(0, intercept + slope * monthsCount);
    const lastMonth = monthlyTotals[monthsCount - 1] || 0;
    const trendPercent = lastMonth ? ((predictedExpense - lastMonth) / lastMonth) * 100 : 0;
    const trendLabel = lastMonth
      ? predictedExpense >= lastMonth
        ? `Up ${Math.abs(trendPercent).toFixed(0)}% vs last month`
        : `Down ${Math.abs(trendPercent).toFixed(0)}% vs last month`
      : "Based on your recent spending pattern";

    const predictedCategory = Object.entries(byCat)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category)[0] ?? null;

    const predictionSummary = expenseTransactions.length
      ? `Predicted next month: ${formatPeso(predictedExpense)} · ${trendLabel}`
      : "Add expense data to see predictions.";

    return { points: buckets, total, count, byCat, predictedExpense, predictionSummary, predictedCategory, availableYears };
  }, [transactions, range, selectedYear]);

  const max = Math.max(...points.map((p) => p.value), 1);
  const W = 320, H = 140, PAD = 8;
  const stepX = (W - PAD * 2) / Math.max(points.length - 1, 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${PAD + i * stepX} ${H - PAD - (p.value / max) * (H - PAD * 2)}`)
    .join(" ");
  const area = `${path} L ${PAD + (points.length - 1) * stepX} ${H - PAD} L ${PAD} ${H - PAD} Z`;

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24 bg-background">
      <header className="px-5 pt-3 pb-3 flex items-center gap-3">
        <button onClick={() => setTab("home")} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold leading-tight">Insight</h1>
          <p className="text-[11px] text-muted-foreground">Statistics</p>
        </div>
      </header>

      <div className="px-5">
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-input">
          {(["Daily", "Weekly", "Monthly", "Yearly"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "h-9 rounded-lg text-xs font-semibold transition-smooth",
                range === r ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              )}
            >{r}</button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-5 text-center">
          <p className="text-xs text-muted-foreground">Total Expense</p>
          <p className="mt-1 text-3xl font-bold">{formatPeso(total)}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{count} transactions</p>
        </div>

        {range === 'Yearly' && availableYears.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'rounded-2xl border px-3 py-2 text-xs font-semibold transition-smooth',
                  selectedYear === year ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'
                )}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Expense</p>
              <p className="text-[11px] text-muted-foreground">Spending trend</p>
            </div>
            <p className="text-xs font-semibold text-primary">{formatPeso(total)}</p>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full h-36">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={PAD} x2={W - PAD} y1={H * g} y2={H * g} className="stroke-border" strokeDasharray="2 4" />
            ))}
            <path d={area} fill="url(#g)" />
            <path d={path} className="stroke-primary fill-none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
            {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((p, i) => (
              <span key={i}>{p.label}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Total" value={formatPeso(total)} />
          <Stat label="Avg" value={formatPeso(count ? total / count : 0)} accent />
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold mb-2">Expense by Category</h3>
          <ul className="space-y-2">
            {Object.entries(byCat).sort(([, a], [, b]) => b - a).map(([k, v]) => {
              const c = CATEGORIES[k as keyof typeof CATEGORIES]; const I = c.icon;
              const pct = Math.round((v / (total || 1)) * 100);
              return (
                <li key={k} className="rounded-2xl bg-card border border-border px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-9 w-9 rounded-xl flex items-center justify-center", c.bg)}>
                      <I className={cn("h-4 w-4", c.tone)} />
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{c.label}</span>
                        <span className="font-semibold">{formatPeso(v)}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {Object.keys(byCat).length === 0 && <li className="text-center text-sm text-muted-foreground py-8">No data for this range.</li>}
          </ul>
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Predicted Expense</p>
              <p className="text-[11px] text-muted-foreground">Based on your last 6 months of spending.</p>
            </div>
            <p className="text-xs font-semibold text-primary">{predictedCategory ? "Top category" : "Prediction"}</p>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-bold">{formatPeso(predictedExpense)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{predictionSummary}</p>
            </div>
            {predictedCategory ? (
              <div className="rounded-2xl bg-muted/40 px-3 py-2 text-right">
                <p className="text-[10px] text-muted-foreground">Most spent</p>
                <p className="mt-1 text-sm font-semibold">{predictedCategory ? CATEGORIES[predictedCategory as keyof typeof CATEGORIES].label : "—"}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <button onClick={() => setOpen(true)} aria-label="Add transaction" className="absolute bottom-20 right-5 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 transition-smooth">
        <Plus className="h-6 w-6" />
      </button>
      <AddTransaction open={open} onOpenChange={setOpen} />
    </div>
  );
}

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className={cn("rounded-2xl border p-3", accent ? "border-primary/40 bg-primary/10" : "border-border bg-card")}>
    <p className="text-[10px] text-muted-foreground">{label}</p>
    <p className={cn("text-sm font-semibold mt-0.5", accent && "text-primary")}>{value}</p>
  </div>
);