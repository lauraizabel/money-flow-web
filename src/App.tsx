import { useEffect } from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./pages/landing";
import { DashboardLayout } from "@/app/layouts/dashboard-layout";
import { AuthLayout } from "@/app/layouts/auth-layout";
import { Login } from "@/features/auth/pages/login";
import { Register } from "@/features/auth/pages/register";
import Overview from "./features/transactions/pages/overview";
import Transactions from "./features/transactions/pages/transactions";
import Categories from "@/features/categories/pages/categories";
import Reports from "./features/transactions/pages/reports";
import Settings from "./features/transactions/pages/settings";
import NotFound from "./pages/not-found";
import Goals from "./features/goals/pages/goals";
import Investments from "./features/investments/pages/investments";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { PublicRoute } from "@/shared/components/public-route";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { setRedirectCallback } from "@/shared/api/axios";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
    setRedirectCallback((path: string) => {
      navigate(path, { replace: true });
    });
  }, [initializeAuth, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="goals" element={<Goals />} />
        <Route path="investments" element={<Investments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
