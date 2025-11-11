import { Card } from "@/shared/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CurrencyHelper } from "../helpers/currency-helper";

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant: "success" | "destructive" | "default";
}

export const BalanceCard = ({
  title,
  amount,
  icon: Icon,
  variant,
}: BalanceCardProps) => {
  const variantStyles = {
    success: "bg-gradient-success text-white",
    destructive: "bg-destructive text-destructive-foreground",
    default: "bg-gradient-primary text-white",
  };

  return (
    <Card
      className={cn(
        "p-6 shadow-medium hover:shadow-strong transition-all duration-300 border-0 animate-fade-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <Icon className="h-5 w-5 opacity-90" />
      </div>
      <p className="text-3xl font-bold">{CurrencyHelper.formatCurrency(amount)}</p>
    </Card>
  );
};
