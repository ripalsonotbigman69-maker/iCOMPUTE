import type { Transaction, UserProfile } from "@/lib/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://real-women-repeat.loca.lt/";

type BootstrapResponse = {
  user: UserProfile;
  transactions: Transaction[];
};

type AuthResponse = {
  user: UserProfile;
  transactions: Transaction[];
};

type PinVerifyResponse = {
  valid: boolean;
};

type SignupRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers ? (init.headers as Record<string, string>) : {}),
  };
  // only set content-type when there's a body to send
  if (init?.body != null) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function bootstrapBackend(email: string): Promise<BootstrapResponse> {
  return requestJson<BootstrapResponse>(`/api/bootstrap?email=${encodeURIComponent(email)}`);
}

export async function saveUserProfile(user: UserProfile): Promise<UserProfile> {
  return requestJson<UserProfile>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export async function saveTransaction(transaction: Omit<Transaction, "id">, ownerEmail: string): Promise<Transaction> {
  return requestJson<Transaction>("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ownerEmail: ownerEmail,
      owner_email: ownerEmail,
      kind: transaction.kind,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date
    }),
  });
}

export async function loginAccount(email: string, password: string): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupAccount(payload: SignupRequest): Promise<UserProfile> {
  return requestJson<UserProfile>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyPinAccount(email: string, pin: string): Promise<PinVerifyResponse> {
  return requestJson<PinVerifyResponse>("/api/auth/pin/verify", {
    method: "POST",
    body: JSON.stringify({ email, pin }),
  });
}

export async function forgotPassword(email: string): Promise<void> {
  return requestJson<void>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email: string, token: string, password: string): Promise<void> {
  return requestJson<void>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, token, password }),
  });
}
