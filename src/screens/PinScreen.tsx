import { useEffect, useState } from "react";
import { Delete, Eye, EyeOff } from "lucide-react";
import { useApp } from "@/state/AppState";
import { toast } from "@/hooks/use-toast";

export default function PinScreen({ mode }: { mode: "create" | "enter" }) {
  const { setStage, setPin, verifyPin } = useApp();
  const [value, setValue] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [firstPin, setFirstPin] = useState("");
  const FAILURE_KEY = "icompute_pin_failures";
  const MAX_FAILURES = 5;

  useEffect(() => {
    if (value.length === 4) {
      setTimeout(() => {
        if (mode === "create") {
          if (!confirming) {
            setFirstPin(value);
            setConfirming(true);
            setValue("");
          } else {
            if (value === firstPin) {
              void setPin(value)
                .then(() => setStage("loginSuccess"))
                .catch(() => {
                  toast({ title: "Could not save PIN", description: "Please try again." });
                  setConfirming(false);
                  setFirstPin("");
                  setValue("");
                });
            } else {
              toast({ title: "PIN doesn't match", description: "Please try again." });
              setConfirming(false);
              setFirstPin("");
              setValue("");
            }
          }
        } else {
          void verifyPin(value)
            .then((valid) => {
              if (valid) {
                // reset failure counter on success
                try { if (typeof window !== "undefined") window.localStorage.removeItem(FAILURE_KEY); } catch {}
                setStage("loginSuccess");
                return;
              }
              // increment failure counter
              try {
                if (typeof window !== "undefined") {
                  const raw = window.localStorage.getItem(FAILURE_KEY);
                  const curr = raw ? Number(raw) || 0 : 0;
                  const next = curr + 1;
                  window.localStorage.setItem(FAILURE_KEY, String(next));
                  const remaining = Math.max(0, MAX_FAILURES - next);
                  if (next >= MAX_FAILURES) {
                    toast({ title: "Too many attempts", description: "App will exit due to repeated wrong PIN entries." });
                    // attempt to exit the app (Cordova/Capacitor wrappers may expose exit APIs)
                    try { window.close(); } catch {}
                    try { (navigator as any)?.app?.exitApp?.(); } catch {}
                    return;
                  }
                  toast({ title: "Wrong PIN", description: `Wrong PIN. ${remaining} attempts left.` });
                } else {
                  toast({ title: "Wrong PIN", description: "Please enter the PIN you created." });
                }
              } catch (e) {
                toast({ title: "Wrong PIN", description: "Please enter the PIN you created." });
              }
              setValue("");
            })
            .catch(() => {
              toast({ title: "PIN verification failed", description: "Please try again." });
              setValue("");
            });
        }
      }, 150);
    }
  }, [value]); // eslint-disable-line

  const press = (k: string) => setValue((v) => (v.length < 4 ? v + k : v));
  const back = () => setValue((v) => v.slice(0, -1));

  const title = mode === "enter" ? "Enter Pin" : confirming ? "Confirm Pin" : "Create Pin";

  return (
    <div className="relative h-full w-full bg-gradient-hero flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial opacity-40" />
      <div className="relative flex-1 flex flex-col items-center justify-center pb-10">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="mt-6 flex items-center gap-3">
          <h2 className="sr-only">PIN display</h2>
          <div className="flex gap-5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-8 w-8 rounded-md flex items-center justify-center transition-smooth ${i < value.length ? "bg-primary text-background shadow-glow scale-110" : "bg-muted text-muted-foreground"}`}>
                {showPin && i < value.length ? value[i] : <span className={`h-3 w-3 rounded-full ${i < value.length ? "bg-background" : "bg-muted"}`} />}
              </span>
            ))}
          </div>
          <button aria-label="Toggle pin visibility" onClick={() => setShowPin((s) => !s)} className="ml-4 text-sm text-foreground/80 hover:text-primary transition">
            {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-14 grid grid-cols-3 gap-x-12 gap-y-7 w-[260px]">
          {["1","2","3","4","5","6","7","8","9"].map((k) => (
            <button key={k} onClick={() => press(k)} className="h-14 text-2xl font-light text-foreground hover:text-primary transition-smooth">
              {k}
            </button>
          ))}
          <span />
          <button onClick={() => press("0")} className="h-14 text-2xl font-light hover:text-primary transition-smooth">0</button>
          <button onClick={back} className="h-14 flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth">
            <Delete className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}