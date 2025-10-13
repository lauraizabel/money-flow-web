import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";
import { CreateTransactionDto } from "@/dto/transaction/create-transaction.dto";
import { transactionsService } from "@/services/transactions-service";
import { useTransactionStore } from "@/stores/useTransactionStore";

export const DashboardLayout = () => {
  const [showForm, setShowForm] = useState(false);
  const { transactions, setTransactions, fetchTransactions } = useTransactionStore();

  const handleAddTransaction = async (transaction: CreateTransactionDto) => {
    await transactionsService.createTransaction(transaction);
    await fetchTransactions();
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    transactionsService.deleteTransaction(id);
    fetchTransactions();
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
              <div className="flex items-center gap-2 ml-auto">
                <ThemeToggle />
                <Button
                  onClick={() => setShowForm(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nova Transação</span>
                </Button>
              </div>
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
