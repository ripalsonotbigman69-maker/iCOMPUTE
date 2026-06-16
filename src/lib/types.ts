export type CategoryKey =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "bills"
  | "healthcare"
  | "education"
  | "others"
  | "salary"
  | "gift";

export type TxKind = "income" | "expense";

export interface Transaction {
  id: string;
  kind: TxKind;
  amount: number;
  category: CategoryKey;
  description: string;
  date: string; // ISO
}

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  monthlyBudget: number;
  pin?: string;
}