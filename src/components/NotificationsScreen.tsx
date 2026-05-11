import React, { useState, useEffect } from 'react';
import { Bell, CreditCard, Sparkles, Clock, Loader2, CheckCheck } from 'lucide-react';
import { api, NotificacionOut } from '../services/api';

// Mapeo de tipo de notificación a icono
const renderIcon = (tipo: string, leida: boolean) => {
  const cls = leida ? 'text-slate-400' : 'text-white';
  switch (tipo) {
    case 'reserva':    return <Sparkles size={20} className={cls} />;
    case 'recordatorio': return <Clock size={20} className={cls} />;
    case 'pago':       return <CreditCard size={20} className={cls} />;
    default:           return <Bell size={20} className={cls} />;
  }
};

const tipoColor: Record<string, string> = {
  reserva:      'bg-primary-light',
  recordatorio: 'bg-surface-low',
  pago:         'bg-surface-low',
  promo:        'bg-surface-low',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1)  return 'Ahora mismo';
  if (min < 60) return `Hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
}

export const NotificationsScreen: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<NotificacionOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.notificaciones.listar()
      .then(setNotificaciones)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleMarcarLeida = async (id: number) => {
    try {
      const updated = await api.notificaciones.marcarLeida(id);
      setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch { /* silently fail */ }
  };

  const handleMarcarTodas = async () => {
    try {
      await api.notificaciones.marcarTodasLeidas();
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch { /* silently fail */ }
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-2">
              Notificaciones
            </h1>
            <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
              Mantente al tanto de tus servicios de limpieza y actualizaciones de cuenta en tiempo real.
            </p>
          </div>
          {noLeidas > 0 && (
            <button
              onClick={handleMarcarTodas}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-low text-primary text-sm font-bold hover:bg-primary/10 transition-colors mt-2 shrink-0"
            >
              <CheckCheck size={16} />
              Marcar todas
            </button>
          )}
        </div>
        {noLeidas > 0 && (
          <span className="inline-block mt-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
            {noLeidas} sin leer
          </span>
        )}
      </header>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="md:w-1/4 pt-2">
            <span className="text-[1.1rem] font-manrope font-bold uppercase tracking-wider text-primary px-3 py-1 bg-teal-50 rounded-full">
              Reciente
            </span>
          </div>

          <div className="md:w-3/4 w-full space-y-4">
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-16 gap-3">
                <Loader2 size={28} className="text-primary animate-spin" />
                <p className="text-on-surface-variant font-medium">Cargando notificaciones...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-12 bg-red-50 rounded-3xl">
                <p className="text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && notificaciones.length === 0 && (
              <div className="text-center py-12 bg-surface-low rounded-3xl">
                <Bell size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-on-surface mb-2">No hay notificaciones</h3>
                <p className="text-on-surface-variant">Estás al día con todas tus alertas.</p>
              </div>
            )}

            {/* Notificaciones */}
            {!loading && !error && notificaciones.map((n) => (
              <div
                key={n.id}
                className={`card-editorial p-6 relative overflow-hidden transition-all hover:translate-x-1 ${
                  !n.leida ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tipoColor[n.tipo] || 'bg-surface-low'}`}>
                    {renderIcon(n.tipo, n.leida)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-on-surface leading-snug">{n.titulo}</h3>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {n.descripcion}
                    </p>
                    {!n.leida && (
                      <button
                        onClick={() => handleMarcarLeida(n.id)}
                        className="bg-primary text-white text-xs font-bold py-2 px-4 rounded-full transition-all active:scale-95"
                      >
                        Marcar como leída
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
