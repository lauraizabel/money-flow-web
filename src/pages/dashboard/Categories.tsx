import { CategoryManager } from "@/components/CategoryManager";

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorias</h1>
        <p className="text-muted-foreground">
          Gerencie suas categorias personalizadas de receitas e despesas
        </p>
      </div>

      <CategoryManager />
    </div>
  );
};

export default Categories;
