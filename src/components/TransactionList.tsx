import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { TransactionModel } from "@/model/transaction-model";
import { cn, formatDateFromBackend } from "@/lib/utils";

interface TransactionListProps {
  transactions: TransactionModel[];
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  onDelete,
}: TransactionListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma transação registrada ainda.</p>
        <p className="text-sm mt-2">
          Clique em "Nova Transação" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:shadow-soft transition-all duration-200 animate-slide-in"
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                transaction.isIncome
                  ? "bg-success/10"
                  : "bg-destructive/10"
              )}
            >
              {transaction.isIncome ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatDateFromBackend(transaction.date.toISOString())}</span>
                <span>•</span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {transaction.category?.name || 'Sem categoria'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p
              className={cn(
                "font-bold text-lg",
                transaction.isIncome
                  ? "text-success"
                  : "text-destructive"
              )}
            >
              {transaction.isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(transaction.id)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
