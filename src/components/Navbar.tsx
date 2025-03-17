
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Smartphone, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/lib/api';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, onClick }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all-200 text-sidebar-foreground hover:bg-sidebar-accent group",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado com sucesso.",
      });
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Falha no logout",
        description: "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar navigation */}
      <nav 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar flex flex-col border-r",
          "transition-all-300 shadow-sm",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          !isMobile && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-center h-16 border-b px-4">
          <h1 className="text-lg font-semibold">Traccar Admin</h1>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeMenu} />
          <NavItem to="/devices" icon={Smartphone} label="Dispositivos" onClick={closeMenu} />
          <NavItem to="/users" icon={Users} label="Usuários" onClick={closeMenu} />
          <NavItem to="/database" icon={Database} label="Banco de Dados" onClick={closeMenu} />
          <NavItem to="/settings" icon={Settings} label="Configurações" onClick={closeMenu} />
        </div>

        <div className="p-3 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </nav>
      
      {/* Mobile overlay to close menu when clicking outside */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 animate-fade-in"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
