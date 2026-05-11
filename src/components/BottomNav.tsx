import React from 'react';
import { Home, Calendar, Bell, User, Search, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Search, label: 'Explorar' },
    { id: 'bookings', icon: Calendar, label: 'Reservas' },
    { id: 'notifications', icon: Bell, label: 'Avisos' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-white/90 backdrop-blur-xl rounded-t-[3rem] shadow-ghost border-t border-slate-100">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-all duration-300 ${
              isActive ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[1rem] font-manrope font-bold uppercase tracking-wider mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
