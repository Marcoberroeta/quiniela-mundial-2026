import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CalendarDays, Globe } from 'lucide-react';

const navItems = [
  { path: '/',        label: 'INICIO',  icon: Home,         color: '#E2001A' },
  { path: '/fixture', label: 'FIXTURE', icon: CalendarDays, color: '#0E63B3' },
  { path: '/ranking', label: 'RANKING', icon: Globe,         color: '#FFC20E' },
  { path: '/groups',  label: 'GRUPOS',  icon: Users,         color: '#00923F' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ borderTop: '3px solid #14130f', background: '#e4e1d8' }}
    >
      <div className="flex max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon, color }, idx) => {
          const isActive = location.pathname === path ||
            (path === '/groups' && location.pathname.startsWith('/group'));
          const isYellow = color === '#FFC20E';

          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-colors"
              style={{
                background: isActive ? color : 'transparent',
                color: isActive ? (isYellow ? '#14130f' : '#ffffff') : '#9b968a',
                borderRight: idx < navItems.length - 1 ? '2px solid #14130f' : 'none',
              }}
            >
              <Icon style={{ width: 18, height: 18, strokeWidth: isActive ? 2.5 : 1.5 }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em' }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
