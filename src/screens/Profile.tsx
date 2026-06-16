import { ArrowLeft, Edit3, Landmark, Wallet, CreditCard, LogOut, Plus, Save, Sun, Moon, X, Palette } from "lucide-react";
import { useApp, type ColorTheme } from "@/state/AppState";
import { formatPeso, formatPesoCompact } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { AddTransaction } from "./AddTransaction";

export default function Profile() {
  const { user, setStage, setTab, setUser, balance, totals, colorTheme, setColorTheme } = useApp();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [colorDropdown, setColorDropdown] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(String(user.monthlyBudget ?? 0));
  const [bankBalanceInput, setBankBalanceInput] = useState(String(user.bankBalance ?? 0));
  const [cashOnHandInput, setCashOnHandInput] = useState(String(user.cashOnHand ?? 0));
  const [creditCardBalanceInput, setCreditCardBalanceInput] = useState(String(user.creditCardBalance ?? 0));
  const [debitCardBalanceInput, setDebitCardBalanceInput] = useState(String(user.debitCardBalance ?? 0));

  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setMonthlyBudgetInput(String(user.monthlyBudget ?? 0));
    setBankBalanceInput(String(user.bankBalance ?? 0));
    setCashOnHandInput(String(user.cashOnHand ?? 0));
    setCreditCardBalanceInput(String(user.creditCardBalance ?? 0));
    setDebitCardBalanceInput(String(user.debitCardBalance ?? 0));
  }, [user]);

  const initial = (user.firstName || user.email).charAt(0).toUpperCase();
  const bankBalance = user.bankBalance ?? 0;
  const physicalCash = user.cashOnHand ?? 0;
  const creditCardAmount = user.creditCardBalance ?? 0;
  const debitCardAmount = user.debitCardBalance ?? 0;
  const isLight = theme === "light";

  const saveProfile = () => {
    const monthlyBudget = Number(monthlyBudgetInput) || 0;
    const bankBalance = Number(bankBalanceInput) || 0;
    const cashOnHand = Number(cashOnHandInput) || 0;
    const creditCardBalance = Number(creditCardBalanceInput) || 0;
    const debitCardBalance = Number(debitCardBalanceInput) || 0;

    setUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      monthlyBudget,
      bankBalance,
      cashOnHand,
      creditCardBalance,
      debitCardBalance,
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setMonthlyBudgetInput(String(user.monthlyBudget ?? 0));
    setBankBalanceInput(String(user.bankBalance ?? 0));
    setCashOnHandInput(String(user.cashOnHand ?? 0));
    setCreditCardBalanceInput(String(user.creditCardBalance ?? 0));
    setDebitCardBalanceInput(String(user.debitCardBalance ?? 0));
    setEditing(false);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24 bg-background">
      <header className="px-5 pt-3 pb-3 flex items-center gap-3">
        <button onClick={() => setTab("home")} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold flex-1">User Profile</h1>        <div className="relative">
          <button
            onClick={() => setColorDropdown(!colorDropdown)}
            className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition"
            aria-label="Select color theme"
          >
            <Palette className="h-4 w-4" />
          </button>
          {colorDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-xl shadow-card z-50">
              {(['green', 'blue', 'pink'] as const).map((color) => {
                const colorMap: Record<ColorTheme, { name: string; dot: string }> = {
                  green: { name: 'Green', dot: 'bg-emerald-500' },
                  blue: { name: 'Blue', dot: 'bg-blue-500' },
                  pink: { name: 'Pink', dot: 'bg-pink-500' },
                };
                const { name, dot } = colorMap[color];
                const isActive = colorTheme === color;
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setColorTheme(color);
                      setColorDropdown(false);
                    }}
                    className={`w-full px-4 py-2 flex items-center gap-3 text-sm rounded-lg transition-smooth ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-card/80'
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full ${dot}`} />
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>        <button
          onClick={() => setTheme(isLight ? "dark" : "light")}
          className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition"
          aria-label="Toggle theme"
        >
          {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </header>

      <div className="px-5">
        <div className="rounded-3xl bg-gradient-card border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{initial}</span>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-semibold">{`${user.firstName || "User"}${user.lastName ? ` ${user.lastName}` : ""}`}</p>
                </>
              )}
            </div>
            <button
              onClick={() => setEditing((current) => !current)}
              className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition"
            >
              {editing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </button>
          </div>

          {editing && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Profile details</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account balances</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="bankBalance">Bank balance</Label>
                  <Input
                    id="bankBalance"
                    type="number"
                    value={bankBalanceInput}
                    onChange={(event) => setBankBalanceInput(event.target.value)}
                    placeholder="Bank balance"
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="cashOnHand">Cash on hand</Label>
                  <Input
                    id="cashOnHand"
                    type="number"
                    value={cashOnHandInput}
                    onChange={(event) => setCashOnHandInput(event.target.value)}
                    placeholder="Cash on hand"
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="creditCardBalance">Credit card balance</Label>
                  <Input
                    id="creditCardBalance"
                    type="number"
                    value={creditCardBalanceInput}
                    onChange={(event) => setCreditCardBalanceInput(event.target.value)}
                    placeholder="Credit card balance"
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="debitCardBalance">Debit card balance</Label>
                  <Input
                    id="debitCardBalance"
                    type="number"
                    value={debitCardBalanceInput}
                    onChange={(event) => setDebitCardBalanceInput(event.target.value)}
                    placeholder="Debit card balance"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Budget</p>
              </div>
              <div>
                <Label htmlFor="monthlyBudget">Monthly budget</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={monthlyBudgetInput}
                  onChange={(event) => setMonthlyBudgetInput(event.target.value)}
                  placeholder="Monthly budget"
                  min={0}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button className="flex-1" onClick={saveProfile}>
                  <Save className="h-4 w-4 mr-2" /> Save profile
                </Button>
                <Button variant="outline" className="flex-1" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Account balances</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">Store your real financial accounts here.</p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-xs text-primary font-semibold">
              Edit balances
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <PaymentTile
            icon={<Landmark className="h-5 w-5 text-primary" />}
            label="Bank balance"
            value={formatPeso(bankBalance)}
            description="Current available balance"
          />
          <PaymentTile
            icon={<Wallet className="h-5 w-5 text-primary" />}
            label="Cash on hand"
            value={formatPeso(physicalCash)}
            description="Actual cash you carry"
          />
          <PaymentTile
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            label="Credit card balance"
            value={formatPesoCompact(creditCardAmount)}
            description="Outstanding credit balance"
          />
          <PaymentTile
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            label="Debit card balance"
            value={formatPesoCompact(debitCardAmount)}
            description="Available debit balance"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-muted-foreground">Monthly budget</p>
              <p className="text-sm font-semibold">{formatPesoCompact(user.monthlyBudget)}</p>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs text-primary font-semibold">
                Edit budget
              </button>
            )}
          </div>
        </div>

        <h2 className="mt-6 text-sm font-semibold">Cards</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <PaymentTile
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            label="Credit Card"
            value={formatPesoCompact(creditCardAmount)}
            description="Total expense"
          />
          <PaymentTile
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            label="Debit Card"
            value={formatPesoCompact(debitCardAmount)}
            description="Total income"
          />
        </div>

        <div className="mt-3 rounded-2xl bg-card border border-border p-3 text-sm text-muted-foreground">
          <p className="font-medium">How these work</p>
          <p className="mt-2">Bank Balance, Cash on hand, Credit Card, and Debit Card values are stored from your profile.</p>
          <p className="mt-2">Use these fields to track your real account balances, while transactions feed the analytics.</p>
        </div>

        <Button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("icompute_last_signed_in_email");
            }
            setStage("login");
          }}
          variant="outline"
          className="mt-8 w-full h-12 rounded-xl bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </Button>
      </div>

      <button onClick={() => setOpen(true)} aria-label="Add transaction" className="absolute bottom-20 right-5 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 transition-smooth">
        <Plus className="h-6 w-6" />
      </button>
      <AddTransaction open={open} onOpenChange={setOpen} />
    </div>
  );
}

const PaymentTile = ({ icon, label, value, description }: { icon: React.ReactNode; label: string; value?: string; description?: string }) => (
  <button className="rounded-2xl bg-card border border-border p-4 flex flex-col items-start gap-3 text-left hover:border-primary/50 transition-smooth">
    <span className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">{icon}</span>
    <div>
      <p className="text-xs font-medium">{label}</p>
      {value ? <p className="text-sm font-semibold mt-1">{value}</p> : null}
      {description ? <p className="text-[11px] text-muted-foreground mt-1">{description}</p> : null}
    </div>
  </button>
);