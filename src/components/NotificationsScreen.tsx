import React from 'react';
import { Bell, CheckCircle, Clock, CreditCard, Sparkles } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsScreenProps {
  notifications: AppNotification[];
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ notifications }) => {
  const renderIcon = (type: string, unread: boolean) => {
    const className = unread ? 'text-white' : 'text-slate-400';
    switch (type) {
      case 'sparkles': return <Sparkles size={20} className={className} />;
      case 'clock': return <Clock size={20} className={className} />;
      case 'credit-card': return <CreditCard size={20} className={className} />;
      default: return <Bell size={20} className={className} />;
    }
  };

  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-2">Notificaciones</h1>
        <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
          Mantente al tanto de tus servicios de limpieza y actualizaciones de cuenta en tiempo real.
        </p>
      </header>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="md:w-1/4 pt-2">
            <span className="text-[1.1rem] font-manrope font-bold uppercase tracking-wider text-primary px-3 py-1 bg-teal-50 rounded-full">Reciente</span>
          </div>
          <div className="md:w-3/4 w-full space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 bg-surface-low rounded-3xl">
                <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-on-surface mb-2">No hay notificaciones</h3>
                <p className="text-on-surface-variant">Estás al día con todas tus alertas.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  className={`card-editorial p-6 relative overflow-hidden transition-all hover:translate-x-1 ${
                    n.unread ? 'border-l-4 border-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                      {renderIcon(n.iconType, n.unread)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-on-surface leading-snug">{n.title}</h3>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">{n.time}</span>
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                        {n.desc}
                      </p>
                      {n.unread && (
                        <button className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-full transition-all active:scale-95">
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
