
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Phone,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
          <Phone className="h-6 w-6 text-primary" />
          {isOpen && (
            <span className="ml-2 font-semibold text-xl">Call Admin</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={`${!isOpen && 'absolute right-0 -mr-4 bg-background border border-border rounded-full shadow-md'}`}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          <SidebarItem
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isOpen={isOpen}
          />
          <SidebarItem
            to="/executives"
            icon={<Users size={20} />}
            label="Executives"
            isOpen={isOpen}
          />
          <SidebarItem
            to="/analytics"
            icon={<BarChart3 size={20} />}
            label="Analytics"
            isOpen={isOpen}
          />
          <SidebarItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            isOpen={isOpen}
          />
        </ul>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Button 
          variant="ghost" 
          className={`w-full flex items-center justify-${isOpen ? 'start' : 'center'} text-muted-foreground hover:text-destructive`}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isOpen }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md transition-colors ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          } ${!isOpen && 'justify-center'}`
        }
      >
        {icon}
        {isOpen && <span className="ml-2 text-sm font-medium">{label}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
