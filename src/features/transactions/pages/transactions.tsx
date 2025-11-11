import { useEffect } from "react";
import { Card } from "@/shared/ui/card";
import { TransactionFilters } from "@/features/transactions/components/transaction-filters";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import { useTransactionStore, TransactionFilters as TransactionFiltersType } from "../store/use-transaction-store";
import { Loader2 } from "lucide-react";

const Transactions = () => {
  const { 
    filteredTransactions, 
    isLoading, 
    deleteTransaction, 
    setFilters, 
    fetchTransactions 
  } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transações</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as suas transações
        </p>
      </div>

      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <TransactionFilters />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando transações...</span>
          </div>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onDelete={deleteTransaction}
          />
        )}
      </Card>
    </div>
  );
};

export default Transactions;
