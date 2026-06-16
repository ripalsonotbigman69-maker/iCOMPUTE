import { ChevronRight } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { useApp } from "@/state/AppState";

export default function GetStarted() {
  const { setStage } = useApp();
  return (
    <div className="relative h-full w-full bg-gradient-hero overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      <div className="relative flex-1 flex flex-col items-center px-7 pt-10">
        <div className="w-full aspect-square rounded-3xl bg-card/60 border border-primary/30 shadow-glow flex items-center justify-center backdrop-blur-sm relative overflow-hidden animate-scale-in">
          <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--primary)/0.25)_1px,transparent_1px)] [background-size:14px_14px] opacity-50" />
          <div className="absolute inset-0 bg-gradient-radial" />
          <Logo sub={false} className="scale-[0.95]" />
        </div>
        <h1 className="mt-8 text-center text-3xl font-bold text-balance leading-tight">
          Start tracking your<br />expenses wisely
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground max-w-[280px]">
          Explore the smart tracking expense app to organize your daily expenses
        </p>
      </div>
      <div className="relative px-7 pb-10">
        <Button onClick={() => setStage("login")} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wide shadow-glow group">
          GET STARTED
          <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}