import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Wallet,
  Gift,
  type LucideIcon,
} from "lucide-react";
import type { CategoryKey } from "./types";

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
  tone: string; // tailwind text class
  bg: string; // tailwind bg class
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  food: { key: "food", label: "Food & Dining", icon: UtensilsCrossed, tone: "text-orange-300", bg: "bg-orange-500/15" },
  transport: { key: "transport", label: "Transportation", icon: Car, tone: "text-sky-300", bg: "bg-sky-500/15" },
  shopping: { key: "shopping", label: "Shopping", icon: ShoppingBag, tone: "text-pink-300", bg: "bg-pink-500/15" },
  entertainment: { key: "entertainment", label: "Entertainment", icon: Film, tone: "text-violet-300", bg: "bg-violet-500/15" },
  bills: { key: "bills", label: "Bills & Utilities", icon: Receipt, tone: "text-yellow-300", bg: "bg-yellow-500/15" },
  healthcare: { key: "healthcare", label: "Healthcare", icon: HeartPulse, tone: "text-rose-300", bg: "bg-rose-500/15" },
  education: { key: "education", label: "Education", icon: GraduationCap, tone: "text-blue-300", bg: "bg-blue-500/15" },
  others: { key: "others", label: "Others", icon: Sparkles, tone: "text-emerald-300", bg: "bg-emerald-500/15" },
  salary: { key: "salary", label: "Salary", icon: Wallet, tone: "text-emerald-300", bg: "bg-emerald-500/15" },
  gift: { key: "gift", label: "Gift", icon: Gift, tone: "text-fuchsia-300", bg: "bg-fuchsia-500/15" },
};

export const EXPENSE_CATEGORIES: CategoryKey[] = [
  "food", "transport", "shopping", "entertainment", "bills", "healthcare", "education", "others",
];

export const INCOME_CATEGORIES: CategoryKey[] = ["salary", "gift", "others"];