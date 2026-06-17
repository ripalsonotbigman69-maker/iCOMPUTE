import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Transaction, UserProfile, TxKind, CategoryKey } from "@/lib/types";
import { bootstrapBackend, loginAccount, saveTransaction, saveUserProfile, signupAccount, verifyPinAccount } from "@/lib/backend";

const LAST_SIGNED_EMAIL_KEY = "icompute_last_signed_in_email";

export type Stage =
  | "onboarding"
  | "getStarted"
  | "auth" // login or signup chooser is implicit; we route via screen
  | "login"
  | "signup"
  | "verify"
  | "createPin"
  | "enterPin"
  | "loginSuccess"
  | "app";

export type Tab = "home" | "expenses" | "insight" | "profile";
export type ColorTheme = "green" | "blue" | "pink";

const COLOR_THEME_KEY = "icompute_color_theme";

interface AppCtx {
  stage: Stage;
  setStage: (s: Stage) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  user: UserProfile;
  setUser: (u: Partial<UserProfile>) => void;
  pin: string | null;
  setPin: (p: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (payload: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  verifyPin: (pinValue: string) => Promise<boolean>;
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => Promise<Transaction>;
  balance: number;
  totals: { income: number; expense: number };
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStage] = useState<Stage>("onboarding");
  const [tab, setTab] = useState<Tab>("home");
  const [user, setUserState] = useState<UserProfile>({
    email: "icompute@gmail.com",
    firstName: "User",
    lastName: "",
    monthlyBudget: 23000,
  });
  const [pin, setPinState] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("green");

  useEffect(() => {
    let active = true;

    const storedEmail = typeof window !== "undefined" ? window.localStorage.getItem(LAST_SIGNED_EMAIL_KEY) : null;
    const storedColor = (typeof window !== "undefined" ? window.localStorage.getItem(COLOR_THEME_KEY) : null) as ColorTheme | null;
    const bootEmail = storedEmail ?? user.email;

    if (storedEmail) {
      setUserState((current) => ({ ...current, email: storedEmail }));
      setStage("enterPin");
    }

    if (storedColor && ["green", "blue", "pink"].includes(storedColor)) {
      setColorThemeState(storedColor);
    }

    bootstrapBackend(bootEmail)
      .then(({ user: remoteUser, transactions: remoteTransactions }) => {
        if (!active) return;
        setUserState((current) => ({ ...current, ...remoteUser }));
        if (remoteUser.pin) setPinState(remoteUser.pin);
        setTransactions(remoteTransactions);
      })
      .catch(() => {
        if (!active) return;
        setTransactions([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const setUser = (u: Partial<UserProfile>) => {
    setUserState((p) => {
      const nextUser = { ...p, ...u };
      void saveUserProfile(nextUser).catch(() => {
        console.warn("Unable to save user profile to backend.");
      });
      return nextUser;
    });
  };
  const setPin = async (p: string) => {
    setPinState(p);
    const nextUser = { ...user, pin: p };
    await saveUserProfile(nextUser).catch(() => {
      console.warn("Unable to save PIN to backend.");
    });
  };

  const login = async (email: string, password: string) => {
    const account = await loginAccount(email, password);
    setUserState(account.user);
    setPinState(account.user.pin ?? null);
    setTransactions(account.transactions);
    return account.user;
  };

  const verifyPin = async (pinValue: string) => {
    const result = await verifyPinAccount(user.email, pinValue);
    return result.valid;
  };

  const signup = async (payload: { email: string; password: string; firstName: string; lastName: string }) => {
    await signupAccount({
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
  };
  const setColorTheme = (c: ColorTheme) => {
    setColorThemeState(c);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COLOR_THEME_KEY, c);
      document.documentElement.setAttribute("data-color", c);
    }
  };

  const addTransaction = async (t: Omit<Transaction, "id">) => {
    // Falls back to a random string generator if the browser blocks crypto.randomUUID
    const uniqueId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11);

    const nextTransaction = { ...t, id: uniqueId };
    setTransactions((prev) => [nextTransaction, ...prev]);

    try {
      const savedTransaction = await saveTransaction(t, user.email);
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === nextTransaction.id ? savedTransaction : transaction
        )
      );
      return savedTransaction;
    } catch (error) {
      setTransactions((current) => current.filter((transaction) => transaction.id !== nextTransaction.id));
      console.warn("Unable to save transaction to backend.", error);
      throw error;
    }
  };

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach((t) => (t.kind === "income" ? (income += t.amount) : (expense += t.amount)));
    return { income, expense };
  }, [transactions]);

  const balance = totals.income - totals.expense;

  // Sync color theme to HTML on mount and when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-color", colorTheme);
    }
  }, [colorTheme]);

  return (
    <Ctx.Provider value={{ stage, setStage, tab, setTab, user, setUser, pin, setPin, login, signup, verifyPin, transactions, addTransaction, balance, totals, colorTheme, setColorTheme }}>
      {children}
    </Ctx.Provider>
  );
};

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
};

export type { CategoryKey, TxKind };