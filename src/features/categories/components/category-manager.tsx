import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { useCategoryStore } from "@/features/categories/store/use-category-store";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CreateCategoryDto } from "@/features/categories/dto/create-category.dto";
import { categoriesService } from "@/features/categories/services/categories-service";

const CATEGORY_ICONS = ["🍔", "🏠", "🚗", "💰", "🎮", "🏥", "✈️", "📚", "🎬", "🛒"];
const CATEGORY_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#14B8A6"];

export const CategoryManager = () => {
  const { categories, fetchCategories, addCategory } = useCategoryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<CreateCategoryDto>({
    name: "",
    type: "EXPENSE",
    color: CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0],
  });

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }

    try {
      await addCategory(newCategory);
      await fetchCategories();
      toast.success("Categoria criada com sucesso!");
      setNewCategory({
        name: "",
        type: "EXPENSE",
        color: CATEGORY_COLORS[0],
        icon: CATEGORY_ICONS[0],
      });
      setIsAdding(false);
    } catch (error) {
      toast.error("Erro ao criar categoria");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoriesService.deleteCategory(id);
      await fetchCategories();
      toast.success("Categoria removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover categoria");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorias Personalizadas</h2>
        <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Ex: Lazer, Educação, Investimentos..."
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={newCategory.type} onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                  <SelectItem value="INCOME">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ícone</Label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_ICONS.map((icon) => (
                  <Button
                    key={icon}
                    variant={newCategory.icon === icon ? "default" : "outline"}
                    className="text-2xl h-12 w-12"
                    onClick={() => setNewCategory({ ...newCategory, icon })}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {CATEGORY_COLORS.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className="h-10 w-10 p-0"
                    style={{ backgroundColor: newCategory.color === color ? color : 'transparent', borderColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  >
                    {newCategory.color === color && "✓"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="flex-1">Adicionar</Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">Cancelar</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.filter(c => !c.isDefault).map((category) => (
          <Card key={category.id} className="p-4 bg-gradient-card shadow-soft border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.type === "EXPENSE" ? "Despesa" : "Receita"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {categories.filter(c => !c.isDefault).length === 0 && !isAdding && (
        <Card className="p-12 bg-gradient-card shadow-soft border-border/50 text-center">
          <p className="text-muted-foreground">
            Nenhuma categoria personalizada. Clique em "Nova Categoria" para criar.
          </p>
        </Card>
      )}
    </div>
  );
};
