import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/state/AppState";
import { toast } from "@/hooks/use-toast";
import { forgotPassword, resetPassword } from "@/lib/backend";

type Mode = "login" | "forgotRequest" | "resetPassword";

const KEEP_SIGNED_IN_KEY = "icompute_last_signed_in_email";
const isValidEmail = (value: string) => /.+@.+\..+/.test(value.trim());

export default function Login() {
  const { setStage, login } = useApp();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [resetToken, setResetToken] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const submit = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }
    if (!pwd) {
      toast({ title: "Missing details", description: "Please enter email and password" });
      return;
    }

    try {
      const account = await login(email, pwd);

      if (keepSignedIn && typeof window !== "undefined") {
        window.localStorage.setItem(KEEP_SIGNED_IN_KEY, email);
      } else if (typeof window !== "undefined") {
        window.localStorage.removeItem(KEEP_SIGNED_IN_KEY);
      }

      setStage(account.pin ? "enterPin" : "createPin");
    } catch (error) {
      toast({ title: "Login failed", description: "Wrong email or password." });
    }
  };

  const handleSendReset = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }

    try {
      await forgotPassword(email);
      toast({ title: "Reset email sent", description: "Check your inbox for the password reset code." });
      setMode("resetPassword");
    } catch (error) {
      toast({ title: "Reset failed", description: "Unable to send reset email. Check the email address or server configuration." });
    }
  };

  const handleResetPassword = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address." });
      return;
    }
    if (!resetToken) {
      toast({ title: "Missing token", description: "Enter the reset code from your email." });
      return;
    }
    if (!newPwd || !confirmPwd) {
      toast({ title: "Missing password", description: "Enter and confirm your new password." });
      return;
    }
    if (newPwd !== confirmPwd) {
      toast({ title: "Passwords do not match", description: "Please make sure both passwords are the same." });
      return;
    }

    try {
      await resetPassword(email, resetToken, newPwd);
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      setMode("login");
      setPwd("");
      setResetToken("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (error) {
      toast({ title: "Reset failed", description: "Unable to reset password. Check your email code and try again." });
    }
  };

  return (
    <div className="relative h-full w-full bg-gradient-hero overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="relative px-7 pt-6 pb-10 min-h-full flex flex-col">
        <p className="text-center text-xs text-muted-foreground">Let's login to start tracking your expenses!</p>
        <div className="mt-6"><Logo /></div>

        {mode === "login" ? (
          <>
            <div className="mt-10 space-y-4">
              <Field label="Email or Phone Number">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              </Field>
              <Field label="Password">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input type={show ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Enter your password" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <Checkbox
                    checked={keepSignedIn}
                    onCheckedChange={(value) => setKeepSignedIn(Boolean(value))}
                    className="border-muted-foreground/40"
                  />
                  Keep me signed in
                </label>
                <button type="button" onClick={() => setMode("forgotRequest")} className="text-primary font-medium">Forgot password</button>
              </div>
            </div>

            <Button onClick={submit} className="mt-8 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">Sign in</Button>
          </>
        ) : mode === "forgotRequest" ? (
          <>
            <div className="mt-10 space-y-4">
              <Field label="Email for reset">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              </Field>
            </div>

            <Button onClick={handleSendReset} className="mt-8 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">Send reset email</Button>
            <Button variant="secondary" onClick={() => setMode("login")} className="mt-3 w-full h-14 rounded-2xl">Back to sign in</Button>
          </>
        ) : (
          <>
            <div className="mt-10 space-y-4">
              <Field label="Email">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              </Field>
              <Field label="Reset code">
                <Input value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Enter the code from email" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              </Field>
              <Field label="New password">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input type={show ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Enter a new password" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
              </Field>
              <Field label="Confirm password">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Input type={show ? "text" : "password"} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Confirm your new password" className="border-0 bg-transparent focus-visible:ring-0 px-0 h-9" />
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>
            </div>

            <Button onClick={handleResetPassword} className="mt-8 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">Reset password</Button>
            <Button variant="secondary" onClick={() => setMode("login")} className="mt-3 w-full h-14 rounded-2xl">Back to sign in</Button>
          </>
        )}

        <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          Don't have an account? <button onClick={() => setStage("signup")} className="text-primary font-semibold">Sign up here</button>
        </p>
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground">{label}</label>
    <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-input/60 border border-border px-4 h-12">{children}</div>
  </div>
);