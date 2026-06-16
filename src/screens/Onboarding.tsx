import { useEffect } from "react";
import { Logo } from "@/components/app/Logo";
import { useApp } from "@/state/AppState";

export default function Onboarding() {
  const { setStage } = useApp();
  useEffect(() => {
    const t = setTimeout(() => setStage("getStarted"), 2200);
    return () => clearTimeout(t);
  }, [setStage]);
  return (
    <div className="relative h-full w-full bg-gradient-hero overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-radial opacity-70" />
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--primary)/0.18)_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />
      <div className="relative animate-fade-in">
        <Logo />
      </div>
    </div>
  );
}