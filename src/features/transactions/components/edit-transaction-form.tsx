import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CATEGORY_TYPE } from "@/shared/constants/category-type.const";
import { useCategoryStore } from "@/features/categories/store/use-category-store";
import { UpdateTransactionDto } from "@/features/transactions/dto/update-transaction.dto";
import { TransactionModel } from "@/shared/model/transaction.model";
import { QuickCategoryCreate } from "@/features/categories/components/quick-category-create";
import { CurrencyHelper } from "@/shared/helpers/currency-helper";

interface EditTransactionFormProps {
  transaction: TransactionModel;
  onSubmit: (id: string, transaction: UpdateTransactionDto) => void;
  onCancel: () => void;
}

export const EditTransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
}: EditTransactionFormProps) => {
  const [type, setType] = useState<string>(transaction.type);
  const [amount, setAmount] = useState(CurrencyHelper.formatCurrency(transaction.amount));
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.categoryId);
  const [date, setDate] = useState(() => {
    return new Date(transaction.date).toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !date) return;
    
    const transactionToUpdate = new UpdateTransactionDto({
      type,
      amount: parseFloat(amount),
      description,
      date,
      categoryId: category,
      tags: transaction.tags,
    });

    onSubmit(transaction.id, transactionToUpdate);
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
      <Card className="w-full max-w-md bg-card border-border/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">Editar Transação</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CATEGORY_TYPE.EXPENSE}>
                  💸 Despesa
                </SelectItem>
                <SelectItem value={CATEGORY_TYPE.INCOME}>
                  💰 Receita
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              placeholder="R$ 0,00"
              value={amount}
              onChange={(e) => setAmount(CurrencyHelper.formatCurrency(CurrencyHelper.parseCurrency(e.target.value)))}
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
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
