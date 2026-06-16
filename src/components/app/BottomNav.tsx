import { Home, Receipt, BarChart3, User } from "lucide-react";
import { useApp, type Tab } from "@/state/AppState";
import { cn } from "@/lib/utils";

const items: { key: Tab; label: string; Icon: typeof Home }[] = [
  { key: "home", label: "Home", Icon: Home },
  { key: "expenses", label: "Expenses", Icon: Receipt },
  { key: "insight", label: "Insight", Icon: BarChart3 },
  { key: "profile", label: "Profile", Icon: User },
];

export const BottomNav = () => {
  const { tab, setTab } = useApp();
  return (
    <nav className="absolute bottom-0 inset-x-0 z-20 border-t border-border/60 bg-card/95 backdrop-blur-xl">
      <ul className="grid grid-cols-4 px-2 py-2 pb-3">
        {items.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <li key={key}>
              <button
                onClick={() => setTab(key)}
                className={cn(
                  "w-full flex flex-col items-center gap-1 py-2 rounded-xl transition-smooth",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_hsl(var(--primary)/0.7)]")} />
                <span className="text-[10px] font-medium">{label}</span>
                {active && <span className="h-0.5 w-6 rounded-full bg-primary shadow-glow" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};