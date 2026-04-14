import React from 'react';
import { Bell, CheckCircle, Clock, CreditCard, Sparkles } from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: '¡Reserva Confirmada!',
      desc: 'Tu servicio de limpieza profunda para mañana a las 09:00 AM ha sido asignado a Elena Gómez.',
      time: 'Hace 5 min',
      icon: Sparkles,
      color: 'bg-primary-light',
      unread: true
    },
    {
      id: 2,
      title: 'Recordatorio',
      desc: 'No olvides calificar tu último servicio realizado el pasado martes. Tu opinión nos ayuda a mejorar.',
      time: 'Hace 2 horas',
      icon: Clock,
      color: 'bg-surface-low',
      unread: false
    },
    {
      id: 3,
      title: 'Pago Procesado',
      desc: 'Hemos recibido correctamente el pago de tu suscripción mensual Premium.',
      time: 'Ayer',
      icon: CreditCard,
      color: 'bg-surface-low',
      unread: false
    }
  ];

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
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`card-editorial p-6 relative overflow-hidden transition-all hover:translate-x-1 ${
                  n.unread ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${n.color}`}>
                    <n.icon size={20} className={n.unread ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-on-surface leading-snug">{n.title}</h3>
                      <span className="text-xs text-slate-400 font-medium">{n.time}</span>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {n.desc}
                    </p>
                    {n.unread && (
                      <button className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-full transition-all active:scale-95">
                        Ver Detalles
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
