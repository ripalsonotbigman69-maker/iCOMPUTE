import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog";
import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import type { CategoryKey, TxKind } from "@/lib/types";
import { useApp } from "@/state/AppState";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const AddTransaction = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { addTransaction, user} = useApp();
  const [kind, setKind] = useState<TxKind>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [desc, setDesc] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const list = kind === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const reset = () => { setAmount(""); setCategory(null); setDesc(""); setKind("expense"); };

const save = () => {
    console.log("Save button clicked! Raw amount state:", amount);
    const amt = parseFloat(amount);
    
    if (isNaN(amt) || amt <= 0) {
      console.log("Stuck on amount validation. Parsed amount:", amt);
      return toast({ title: "Enter a valid amount" });
    }
    
    if (!category) {
      console.log("Stuck on category validation.");
      return toast({ title: "Pick a category" });
    }

    console.log("Validation passed! Sending payload to addTransaction...");
    
    try {
      addTransaction({
        kind, 
        amount: amt, 
        category, 
        description: desc || CATEGORIES[category].label,
        date: new Date().toISOString(),
      });
      
      toast({ title: "Transaction saved successfully" });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error inside addTransaction function:", error);
      toast({ title: "Error processing transaction" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-[390px] w-[calc(100%-2rem)] rounded-3xl bg-card border-border overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-3 flex-row items-center justify-between space-y-0 border-b border-border/60">
          <div>
            <DialogTitle className="text-base">Add Transaction</DialogTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">Record your income or expense</p>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div>
            <p className="text-[11px] text-muted-foreground">Amount</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-light text-muted-foreground">₱</span>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="border-0 bg-transparent focus-visible:ring-0 px-0 h-12 text-3xl font-semibold"
                inputMode="decimal"
              />
            </div>
            <div className="h-px bg-border" />
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-2">Transaction</p>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-input">
              {(["expense", "income"] as TxKind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => { setKind(k); setCategory(null); }}
                  className={cn(
                    "h-10 rounded-lg text-xs font-bold uppercase tracking-wider transition-smooth",
                    kind === k ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
                  )}
                >{k}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-1.5">Category</p>
            <button onClick={() => setPickerOpen(true)} className="w-full h-12 px-4 rounded-xl bg-input border border-border flex items-center justify-between text-sm">
              {category ? (
                <span className="flex items-center gap-2">
                  <span className={cn("h-6 w-6 rounded-md flex items-center justify-center", CATEGORIES[category].bg)}>
                    {(() => { const I = CATEGORIES[category].icon; return <I className={cn("h-3.5 w-3.5", CATEGORIES[category].tone)} />; })()}
                  </span>
                  {CATEGORIES[category].label}
                </span>
              ) : (
                <span className="text-muted-foreground">Select category</span>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-1.5">Description</p>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Weekly groceries" className="bg-input border-border resize-none h-20" />
          </div>

          <div>
            <p className="text-[11px] text-muted-foreground mb-1.5">Date</p>
            <div className="h-12 px-4 rounded-xl bg-input border border-border flex items-center text-sm">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <Button onClick={save} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">
            Save Transaction
          </Button>
        </div>
      </DialogContent>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="p-0 gap-0 max-w-[390px] w-[calc(100%-2rem)] rounded-3xl bg-card border-border overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-3 flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-base">Select Category</DialogTitle>
            <DialogClose className="text-muted-foreground"><X className="h-5 w-5" /></DialogClose>
          </DialogHeader>
          <div className="px-5 pb-6 grid grid-cols-2 gap-3">
            {list.map((k) => {
              const c = CATEGORIES[k]; const I = c.icon;
              return (
                <button
                  key={k}
                  onClick={() => { setCategory(k); setPickerOpen(false); }}
                  className="aspect-square rounded-2xl bg-input border border-border flex flex-col items-center justify-center gap-2 hover:border-primary/60 transition-smooth"
                >
                  <span className={cn("h-12 w-12 rounded-xl flex items-center justify-center", c.bg)}>
                    <I className={cn("h-6 w-6", c.tone)} />
                  </span>
                  <span className="text-xs font-medium">{c.label}</span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};