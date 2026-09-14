import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";


const nav = [
  { to: "/", label: "Menu de Serviços", icon: LayoutDashboard, exact: true, activeClass: "bg-primary text-primary-foreground" },
  { to: "/ordens-servico", label: "Ordens de Serviço", icon: ClipboardList, exact: false, activeClass: "bg-warning text-warning-foreground" },
  { to: "/clientes", label: "Clientes", icon: Users, exact: false, activeClass: "bg-success text-success-foreground" },
  { to: "/produtos", label: "Produtos", icon: Package, exact: false, activeClass: "bg-info text-info-foreground" },
] as const;

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuthContext();

  return (
    <aside className="app-sidebar hidden w-52 shrink-0 flex-col overflow-hidden border-r bg-card transition-[width] duration-200 md:flex">
      <div className="flex items-center gap-2 px-3 py-5 border-b">
        <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
          <Settings className="h-5 w-5" />
        </div>
        <div className="sidebar-copy min-w-0 whitespace-nowrap transition-opacity duration-150">
          <p className="text-sm font-bold leading-tight">SmarTech</p>
          <p className="text-xs text-muted-foreground">Controle de OS</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                 ? item.activeClass
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
               <Icon className="h-4 w-4 shrink-0" />
               <span className="sidebar-copy whitespace-nowrap transition-opacity duration-150">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      </aside>
  );
}
