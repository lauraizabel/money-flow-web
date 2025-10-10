import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Transaction } from "@/pages/Dashboard";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  onCancel: () => void;
}

export const TransactionForm = ({
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString().split("T")[0],
    });

    setAmount("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-md p-6 bg-gradient-card shadow-strong border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Nova Transação</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={type === "income" ? "default" : "outline"}
                className={
                  type === "income" ? "bg-success hover:bg-success/90" : ""
                }
                onClick={() => setType("income")}
              >
                Receita
              </Button>
              <Button
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                className={
                  type === "expense"
                    ? "bg-destructive hover:bg-destructive/90"
                    : ""
                }
                onClick={() => setType("expense")}
              >
                Despesa
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Salário, Supermercado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
