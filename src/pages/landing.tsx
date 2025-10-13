import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ArrowRight, TrendingUp, Wallet, PieChart, Shield } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              FinanceFlow
            </span>
          </div>
          <Link to="/login">
            <Button variant="default" className="gap-2">
              Entrar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Controle suas{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  finanças
                </span>{" "}
                de forma inteligente
              </h1>
              <p className="text-lg text-muted-foreground">
                Organize seus gastos, acompanhe suas receitas e mantenha seu
                orçamento sempre sob controle. Simples, rápido e eficiente.
              </p>
              <div className="flex gap-4">
                <Link to="/login">
                  <Button size="lg" className="gap-2 shadow-medium">
                    Começar Agora
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img
                src={heroImage}
                alt="Financial management dashboard preview"
                className="relative rounded-2xl shadow-strong w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tudo que você precisa para gerenciar seu dinheiro
            </h2>
            <p className="text-muted-foreground text-lg">
              Funcionalidades pensadas para facilitar sua vida financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Visão Geral</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe seu saldo total e saiba se está positivo ou negativo
                em tempo real.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Receitas e Gastos</h3>
              <p className="text-sm text-muted-foreground">
                Registre todas as suas entradas e saídas de dinheiro de forma
                organizada.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Gráficos Visuais</h3>
              <p className="text-sm text-muted-foreground">
                Visualize seus dados financeiros através de gráficos intuitivos
                e claros.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Simples e Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Interface intuitiva com foco na facilidade de uso e
                privacidade dos seus dados.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 bg-gradient-primary text-white text-center shadow-strong border-0">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Pronto para organizar suas finanças?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Comece agora e tenha controle total do seu dinheiro
            </p>
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-medium"
              >
                Começar Agora
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 FinanceFlow. Gerencie suas finanças com inteligência.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
