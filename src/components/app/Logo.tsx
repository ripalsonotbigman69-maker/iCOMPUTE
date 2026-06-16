import { cn } from "@/lib/utils";

export const Logo = ({ className, sub = true }: { className?: string; sub?: boolean }) => (
  <div className={cn("flex flex-col items-center", className)}>
    <div className="font-display text-4xl font-black tracking-widest bg-gradient-to-b from-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
      iCOMPUTE
    </div>
    {sub && (
      <div className="mt-1 text-[10px] tracking-[0.45em] text-muted-foreground font-medium">
        SMART EXPENSE TRACKER
      </div>
    )}
  </div>
);