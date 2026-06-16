export const formatPeso = (n: number) =>
  "₱" + new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const formatPesoCompact = (n: number) =>
  "₱" + new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 }).format(n);

export const formatDay = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

export const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};