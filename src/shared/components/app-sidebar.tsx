import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  Settings,
  Wallet,
  ChevronRight,
  Receipt,
  Target,
  FileText,
  FolderKanban,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/shared/ui/sidebar";
import { cn } from "@/shared/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transações",
    url: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    title: "Categorias",
    url: "/dashboard/categories",
    icon: FolderKanban,
  },
  {
    title: "Metas",
    url: "/dashboard/goals",
    icon: Target,
  },
  {
    title: "Relatórios",
    url: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-soft">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              FinanceFlow
            </span>
            <p className="text-xs text-muted-foreground">Controle Financeiro</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground font-medium shadow-soft"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {isActive(item.url) && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 FinanceFlow
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
