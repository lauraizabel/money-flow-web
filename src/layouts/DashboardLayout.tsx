import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";
import { Transaction } from "@/types/transaction";

export const DashboardLayout = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 3500,
      description: "Salário",
      date: "2025-01-05",
      category: "Salário",
    },
    {
      id: "2",
      type: "expense",
      amount: 150,
      description: "Supermercado",
      date: "2025-01-06",
      category: "Alimentação",
    },
    {
      id: "3",
      type: "expense",
      amount: 80,
      description: "Internet",
      date: "2025-01-07",
      category: "Contas",
    },
    {
      id: "4",
      type: "expense",
      amount: 45,
      description: "Uber",
      date: "2025-01-08",
      category: "Transporte",
    },
  ]);
  const [showForm, setShowForm] = useState(false);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-2 lg:hidden">
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  FinanceFlow
                </span>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 ml-auto"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nova Transação</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet
              context={{
                transactions,
                onAddTransaction: handleAddTransaction,
                onDeleteTransaction: handleDeleteTransaction,
              }}
            />
          </main>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};
