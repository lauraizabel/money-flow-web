import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { useCategoryStore } from "@/features/categories/store/use-category-store";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateCategoryDto } from "@/features/categories/dto/create-category.dto";
import { categoriesService } from "@/features/categories/services/categories-service";

const CATEGORY_ICONS = ["🍔", "🏠", "🚗", "💰", "🎮", "🏥", "✈️", "📚", "🎬", "🛒"];
const CATEGORY_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#14B8A6"];

interface QuickCategoryCreateProps {
  type: string;
  onCategoryCreated?: (categoryId: string) => void;
}

export const QuickCategoryCreate = ({ type, onCategoryCreated }: QuickCategoryCreateProps) => {
  const { fetchCategories } = useCategoryStore();
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CreateCategoryDto>({
    name: "",
    type: type,
    color: CATEGORY_COLORS[0],
    icon: CATEGORY_ICONS[0],
  });

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }

    try {
      const created = await categoriesService.createCategory(newCategory);
      await fetchCategories();
      toast.success("Categoria criada com sucesso!");
      setOpen(false);
      setNewCategory({
        name: "",
        type: type,
        color: CATEGORY_COLORS[0],
        icon: CATEGORY_ICONS[0],
      });
      onCategoryCreated?.(created.id);
    } catch (error) {
      toast.error("Erro ao criar categoria");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="quick-name">Nome da Categoria</Label>
            <Input
              id="quick-name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Ex: Lazer, Educação, Investimentos..."
            />
          </div>

          <div>
            <Label>Ícone</Label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_ICONS.map((icon) => (
                <Button
                  key={icon}
                  type="button"
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
                  type="button"
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

          <div className="flex gap-2 pt-4">
            <Button onClick={() => setOpen(false)} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleCreateCategory} className="flex-1">
              Criar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
