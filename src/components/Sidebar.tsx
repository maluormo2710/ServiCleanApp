import React from 'react';
import { Calendar, CreditCard, MapPin, MessageSquare, Settings, Shield, LogOut, X, Tag } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const menuItems = [
    { id: 'bookings', label: 'Mis Reservas', icon: Calendar },
    { id: 'payment-methods', label: 'Métodos de Pago', icon: CreditCard },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'support', label: 'Soporte', icon: MessageSquare },
    { id: 'promotions', label: 'Promociones', icon: Tag },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'admin', label: 'Panel Admin', icon: Shield },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-surface-lowest shadow-ghost z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-extrabold text-primary tracking-tighter">ServiClean</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-surface-low rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-4 text-on-surface hover:bg-surface-low rounded-2xl transition-colors font-bold text-left"
              >
                <item.icon size={20} className="text-primary shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-100">
            <button
              onClick={() => { onNavigate('login'); onClose(); }}
              className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-left"
            >
              <LogOut size={20} className="shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
