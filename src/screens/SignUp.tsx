import { useState } from "react";
import { Mail, User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/state/AppState";
import { toast } from "@/hooks/use-toast";

type Step = "email" | "info";

const isValidEmail = (value: string) => /.+@.+\..+/.test(value.trim());

export default function SignUp() {
  const { setStage, signup } = useApp();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const isStrongPassword = (p: string) => {
    const hasUpper = /[A-Z]/.test(p);
    const hasLower = /[a-z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSymbol = /[^A-Za-z0-9]/.test(p);
    return hasUpper && hasLower && hasNumber && hasSymbol && p.length >= 8 && p.length <= 12;
  };

  const next = () => {
    if (step === "email") {
      if (!isValidEmail(email)) return toast({ title: "Invalid email", description: "Please enter a valid email address." });
      setStep("info");
    } else if (step === "info") {
      if (!first.trim() || !last.trim()) {
        return toast({ title: "Missing details", description: "Please enter your first and last name." });
      }
      if (pwd.length < 6) {
        return toast({ title: "Weak password", description: "Password must be at least 6 characters." });
      }
      if (pwd !== confirm) {
        return toast({ title: "Password mismatch", description: "Make sure passwords match." });
      }

      void signup({ email: email.trim().toLowerCase(), password: pwd, firstName: first.trim(), lastName: last.trim() })
        .then(() => {
          toast({ title: "Successfully made an account" });
          setStage("login");
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : "Unable to create account.";
          toast({ title: "Signup failed", description: message });
        });
    }
  };

  return (
    <div className="relative h-full w-full bg-gradient-hero overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="relative px-7 pt-4 pb-10 min-h-full flex flex-col">
        <button
          onClick={() => (step === "email" ? setStage("login") : setStep(step === "info" ? "email" : "info"))}
          className="self-start p-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-2 text-center">
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign Up to start your expense tracking</p>
        </div>

        {step === "email" && (
          <>
            <div className="mt-8 mx-auto w-44 aspect-square rounded-3xl bg-card/60 border border-primary/30 shadow-glow flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--primary)/0.25)_1px,transparent_1px)] [background-size:10px_10px] opacity-50" />
              <Logo sub={false} className="scale-[0.95]" />
            </div>
            <Field label="Email or Phone Number" className="mt-8">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="icompute@gmail.com" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              {email.includes("@") && <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />}
            </Field>
          </>
        )}

        {step === "info" && (
          <div className="mt-8 space-y-4">
            <Field label="First Name"><User className="h-4 w-4 text-muted-foreground" /><Input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First Name" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" /></Field>
            <Field label="Last Name"><User className="h-4 w-4 text-muted-foreground" /><Input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last Name" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" /></Field>
            <Field label="Password">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input type={showPwd ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Enter your password" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-muted-foreground">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </Field>
            <div className="text-xs text-muted-foreground mt-1">
              Password must be 8–12 characters and include: uppercase, lowercase, a number, and a symbol.
            </div>
            <Field label="Confirm Password"><Lock className="h-4 w-4 text-muted-foreground" /><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" /></Field>
          </div>
        )}

        <Button onClick={next} className="mt-8 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">
          {step === "info" ? "Create Account" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <label className="text-xs text-muted-foreground">{label}</label>
    <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-input/60 border border-border px-4 h-12">{children}</div>
  </div>
);