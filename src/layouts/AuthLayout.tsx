import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              FinanceFlow
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 -z-10" />
        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-md animate-fade-in">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
