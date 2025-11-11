import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Search } from "lucide-react";
import { useCategories } from "@/shared/hooks/use-categories";
import { useTransactionStore, TransactionFilters as TransactionFiltersType } from "../store/use-transaction-store";

export const TransactionFilters = () => {
  const { filters, setFilters } = useTransactionStore();

  const handleFilterChange = (key: keyof TransactionFiltersType, value: string | undefined) => {
    const newFilters = { 
      ...filters, 
      [key]: value === "all" || value === "" ? undefined : value 
    };
    setFilters(newFilters);
  };

  const { data: categories } = useCategories();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="relative">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Descrição..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="INCOME">Receitas</SelectItem>
            <SelectItem value="EXPENSE">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={filters.categoryId || "all"}
          onValueChange={(value) => handleFilterChange("categoryId", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dateFrom">De</Label>
        <Input
          id="dateFrom"
          type="date"
          value={filters.dateFrom || ""}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="dateTo">Até</Label>
        <Input
          id="dateTo"
          type="date"
          value={filters.dateTo || ""}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
        />
      </div>
    </div>
  );
};
