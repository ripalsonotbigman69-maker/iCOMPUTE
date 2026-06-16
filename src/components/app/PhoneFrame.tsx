import type { ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

/** Mobile-first device frame. On small screens it fills the viewport; on larger screens it shows as a phone mockup. */
export const PhoneFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center md:p-6">
      <div className="relative w-full md:w-[390px] md:h-[844px] h-[100dvh] md:rounded-[3rem] md:border md:border-border/50 md:shadow-card overflow-hidden bg-background">
        {/* status bar */}
        <div className="relative z-30 flex items-center justify-between px-7 pt-3 pb-1 text-xs font-medium text-foreground/90">
          <span>08:48</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="relative h-[calc(100%-1.75rem)] overflow-hidden">{children}</div>
      </div>
    </div>
  );
};