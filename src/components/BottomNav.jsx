import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CalendarDays } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/fixture', label: 'Fixture', icon: CalendarDays },
  { path: '/groups', label: 'Mis Grupos', icon: Users },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/60 z-50 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || 
            (path === '/groups' && location.pathname.startsWith('/group'));
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}