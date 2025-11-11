import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { User, Mail, Lock, Trash2, Tag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CategoryManager } from "@/features/categories/components/category-manager";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

const Settings = () => {
  const { user, getMe, isLoading } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleChangePassword = () => {
    toast.success("Senha alterada com sucesso!");
  };

  const handleClearData = () => {
    if (
      confirm(
        "Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita."
      )
    ) {
      toast.success("Dados apagados com sucesso!");
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando configurações...</span>
        </div>
      ) : (
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Informações Pessoais</h2>
              <p className="text-sm text-muted-foreground">
                Atualize seus dados pessoais
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
              Salvar Alterações
            </Button>
          </div>
        </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-soft border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Segurança</h2>
                  <p className="text-sm text-muted-foreground">
                    Mantenha sua conta segura
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Recomendamos alterar sua senha regularmente para manter sua conta
                  segura.
                </p>
                <Button
                  onClick={handleChangePassword}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Alterar Senha
                </Button>
              </div>
            </Card>

            <Separator />

            <Card className="p-6 bg-gradient-card shadow-soft border-destructive/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-destructive">
                    Zona de Perigo
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ações irreversíveis
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Apagar Todos os Dados</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Isso removerá permanentemente todas as suas transações e
                    configurações. Esta ação não pode ser desfeita.
                  </p>
                  <Button
                    onClick={handleClearData}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    Apagar Todos os Dados
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
};

export default Settings;
