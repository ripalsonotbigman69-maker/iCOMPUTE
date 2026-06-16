import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/state/AppState";

export default function LoginSuccess() {
  const { setStage } = useApp();
  useEffect(() => {
    const t = setTimeout(() => setStage("app"), 3500);
    return () => clearTimeout(t);
  }, [setStage]);
  return (
    <div className="relative h-full w-full bg-gradient-hero flex flex-col items-center justify-center px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      {/* confetti dots */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full opacity-70 animate-fade-in"
          style={{
            background: ["hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(0 75% 60%)"][i % 4],
            left: `${10 + ((i * 53) % 80)}%`,
            top: `${15 + ((i * 37) % 60)}%`,
            animationDelay: `${(i % 5) * 0.1}s`,
          }}
        />
      ))}
      <div className="relative z-10 h-40 w-40 rounded-full bg-card border border-border flex items-center justify-center animate-scale-in shadow-card">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-glow animate-pulse-glow">
            <Check className="h-6 w-6 text-primary-foreground" strokeWidth={3} />
          </div>
        </div>
      </div>
      <h2 className="relative z-10 mt-10 text-2xl font-bold">Login Successful</h2>
      <p className="relative z-10 mt-2 text-center text-xs text-muted-foreground max-w-[260px]">
        You will be moved to home screen right now. Enjoy the features!
      </p>
      <Button onClick={() => setStage("app")} className="relative z-10 mt-10 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">
        Lets Explore
      </Button>
    </div>
  );
}