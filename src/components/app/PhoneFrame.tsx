import type { ReactNode } from "react";

/** Mobile-first device frame. On small screens it fills the viewport; on larger screens it shows as a phone mockup. */
export const PhoneFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center md:p-6">
      <div className="relative w-full md:w-[390px] md:h-[844px] h-[100dvh] md:rounded-[3rem] md:border md:border-border/50 md:shadow-card overflow-hidden bg-background">
        <div className="relative h-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
};