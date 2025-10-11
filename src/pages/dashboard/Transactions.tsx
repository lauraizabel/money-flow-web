import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { TransactionFilters } from "@/components/TransactionFilters";
import { TransactionList } from "@/components/TransactionList";

interface DashboardContext {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const Transactions = () => {
  const { transactions, onDeleteTransaction } =
    useOutletContext<DashboardContext>();

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        filters.search === "" ||
        t.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === "all" || t.category === filters.category;

      const matchesDateFrom =
        filters.dateFrom === "" || new Date(t.date) >= new Date(filters.dateFrom);

      const matchesDateTo =
        filters.dateTo === "" || new Date(t.date) <= new Date(filters.dateTo);

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, filters]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transações</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as suas transações
        </p>
      </div>

      <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
        <TransactionFilters onFilterChange={setFilters} />
        <TransactionList
          transactions={filteredTransactions}
          onDelete={onDeleteTransaction}
        />
      </Card>
    </div>
  );
};

export default Transactions;
