import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_TYPE } from "@/const/category-type.const";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { CreateTransactionDto } from "@/dto/transaction/create-transaction.dto";
import { QuickCategoryCreate } from "@/components/QuickCategoryCreate";

interface TransactionFormProps {
  onSubmit: (transaction: CreateTransactionDto) => void;
  onCancel: () => void;
}

export const TransactionForm = ({
  onSubmit,
  onCancel,
}: TransactionFormProps) => {
  const [type, setType] = useState<string>(CATEGORY_TYPE.EXPENSE);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !date) return;
    const transactionToSubmit = new CreateTransactionDto({
      type,
      amount: parseFloat(amount),
      description,
      date,
      categoryId: category,
      tags: [],
    });

    onSubmit(transactionToSubmit);
    setAmount("");
    setDescription("");
    setCategory("");
    setDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
  };

  const { expensesCategories, incomesCategories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    // Garantir que as categorias estejam carregadas quando o formulário for aberto
    if (expensesCategories.length === 0 && incomesCategories.length === 0) {
      fetchCategories();
    }
  }, [expensesCategories.length, incomesCategories.length, fetchCategories]);

  const renderCategories = () => {
    if (type === CATEGORY_TYPE.EXPENSE) {
      return expensesCategories.map((cat) => (
        <SelectItem key={cat.id} value={cat.id}>
          {cat.icon} {cat.name}
        </SelectItem>
      ));
    }

    return incomesCategories.map((cat) => (
      <SelectItem key={cat.id} value={cat.id}>
        {cat.icon} {cat.name}
      </SelectItem>
    ));
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
                variant={type === CATEGORY_TYPE.INCOME ? "default" : "outline"}
                className={
                  type === CATEGORY_TYPE.INCOME ? "bg-success hover:bg-success/90" : ""
                }
                onClick={() => setType(CATEGORY_TYPE.INCOME)}
              >
                Receita
              </Button>
              <Button
                type="button"
                variant={type === CATEGORY_TYPE.EXPENSE ? "default" : "outline"}
                className={
                  type === CATEGORY_TYPE.EXPENSE
                    ? "bg-destructive hover:bg-destructive/90"
                    : ""
                }
                onClick={() => setType(CATEGORY_TYPE.EXPENSE)}
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

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {renderCategories()}
              </SelectContent>
            </Select>
            <QuickCategoryCreate type={type} onCategoryCreated={setCategory} />
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
