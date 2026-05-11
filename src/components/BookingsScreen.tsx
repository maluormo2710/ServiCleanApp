import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ChevronRight, Download, Star, X, CheckCircle, Loader2 } from 'lucide-react';
import { api, ReservaOut } from '../services/api';

interface BookingsScreenProps {
  onNavigateToReport?: () => void;
}

const estadoStyle: Record<string, string> = {
  Finalizado:  'bg-teal-50 text-teal-700',
  Confirmada:  'bg-blue-50 text-blue-700',
  'En Curso':  'bg-violet-50 text-violet-700',
  Pendiente:   'bg-amber-50 text-amber-700',
  Cancelado:   'bg-red-50 text-red-700',
};

export const BookingsScreen: React.FC<BookingsScreenProps> = ({ onNavigateToReport }) => {
  const [reservas, setReservas] = useState<ReservaOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'Finalizado'>('todos');

  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal calificación
  const [ratingReserva, setRatingReserva] = useState<ReservaOut | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    api.reservas.misReservas()
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const reservasFiltradas = filtro === 'todos'
    ? reservas
    : reservas.filter(r => r.estado === filtro);

  const totalInvertido = reservas
    .filter(r => r.estado === 'Finalizado')
    .reduce((acc, r) => acc + r.precio, 0);

  const openRating = (r: ReservaOut) => {
    setRatingReserva(r);
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setIsSubmitted(false);
  };

  const closeRating = () => {
    setRatingReserva(null);
    setTimeout(() => { setIsSubmitted(false); setRating(0); setComment(''); }, 300);
  };

  const handleSubmitRating = async () => {
    if (rating === 0 || !ratingReserva) return;
    setSubmittingRating(true);
    try {
      await api.resenas.crear({
        reserva_id: ratingReserva.id,
        calificacion: rating,
        comentario: comment || undefined,
      });
      // Marcar como calificada en el estado local
      setReservas(prev => prev.map(r =>
        r.id === ratingReserva.id ? { ...r, tiene_resena: true } : r
      ));
      setIsSubmitted(true);
      setTimeout(closeRating, 2000);
    } catch (e: any) {
      alert(e.message || 'Error al enviar la calificación.');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="pb-32 pt-20 px-8 max-w-6xl mx-auto">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-4">
          Tu historial de <span className="text-primary">bienestar.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Revisa los servicios realizados, gestiona tus facturas y califica la experiencia de tus limpiezas pasadas.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="md:col-span-2 bg-surface-low rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <span className="text-sm font-bold uppercase tracking-widest text-primary mb-2 block">Total Invertido</span>
            <h2 className="text-4xl font-bold">${totalInvertido.toFixed(2)}</h2>
          </div>
          <div className="mt-8 relative z-10">
            <button
              onClick={onNavigateToReport}
              className="btn-primary flex items-center gap-2"
            >
              Descargar Reporte Anual
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="bg-amber-100 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
          <Star size={40} className="text-amber-600 fill-amber-600 mb-4" />
          <h3 className="text-2xl font-bold text-amber-800">
            {reservas.filter(r => r.estado === 'Finalizado').length} servicios
          </h3>
          <p className="text-sm text-amber-700 mt-1">Finalizados exitosamente</p>
        </div>
      </div>

      <section className="space-y-10">
        <div className="flex justify-between items-end px-2">
          <h2 className="text-2xl font-bold">Servicios Recientes</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors ${
                filtro === 'todos' ? 'bg-white text-on-surface' : 'text-slate-400 hover:bg-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('Finalizado')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filtro === 'Finalizado' ? 'bg-white text-on-surface' : 'text-slate-400 hover:bg-white'
              }`}
            >
              Finalizados
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-4">
            <Loader2 size={36} className="text-primary animate-spin" />
            <p className="text-on-surface-variant font-medium">Cargando tus reservas...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12 bg-red-50 rounded-3xl">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reservas.length === 0 && (
          <div className="text-center py-16 bg-surface-low rounded-3xl">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">Aún no tienes servicios</h3>
            <p className="text-on-surface-variant">Reserva tu primer servicio de limpieza.</p>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && (
          <div className="space-y-4">
            {reservasFiltradas.map((b) => (
              <div key={b.id} className="card-editorial p-6 transition-all hover:translate-y-[-2px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-surface-low flex items-center justify-center text-primary shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        {b.fecha} • {b.hora}
                      </p>
                      <h3 className="text-lg font-bold">{b.tipo_servicio}</h3>
                      <p className="text-sm text-on-surface-variant">
                        Prestador: <span className="font-semibold text-on-surface">{b.colaborador_nombre}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-xl font-bold">${b.precio.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase mt-1 ${estadoStyle[b.estado] || 'bg-slate-50 text-slate-700'}`}>
                      {b.estado}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 min-w-[140px]">
                    {b.estado === 'Finalizado' && !b.tiene_resena && (
                      <button
                        onClick={() => openRating(b)}
                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-editorial transition-transform active:scale-95"
                      >
                        Calificar
                      </button>
                    )}
                    {b.estado === 'Finalizado' && b.tiene_resena && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-low text-primary text-sm font-bold">
                        <CheckCircle size={16} />
                        Calificado
                      </div>
                    )}
                    <button
                      onClick={() => setExpandedId(prev => prev === b.id ? null : b.id)}
                      className="p-2.5 rounded-full border border-slate-100 text-slate-400 hover:bg-surface-low transition-colors"
                    >
                      <ChevronRight
                        size={20}
                        className={`transition-transform duration-300 ${expandedId === b.id ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Detalles expandidos */}
                {expandedId === b.id && (
                  <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-on-surface mb-4">Detalles del Servicio</h4>
                        <ul className="space-y-3 text-sm text-on-surface-variant mb-6">
                          <li className="flex items-center gap-3">
                            <div className="p-2 bg-surface-low rounded-lg text-primary"><Clock size={16} /></div>
                            {b.duracion_horas}h de servicio
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="p-2 bg-surface-low rounded-lg text-primary"><MapPin size={16} /></div>
                            {b.direccion}
                          </li>
                        </ul>

                        {b.tareas && b.tareas.length > 0 && (
                          <>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tareas incluidas</h5>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {b.tareas.map((t, i) => (
                                <span key={i} className="px-3 py-1.5 bg-surface-low text-xs font-bold text-on-surface-variant rounded-full">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        {b.comentarios_cliente && (
                          <>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Comentarios</h5>
                            <div className="bg-amber-50 p-4 rounded-2xl text-sm text-amber-800 italic">
                              "{b.comentarios_cliente}"
                            </div>
                          </>
                        )}
                      </div>

                      <div className="bg-surface-low p-6 rounded-3xl h-fit">
                        <h4 className="font-bold text-on-surface mb-5">Resumen de Pago</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between text-on-surface-variant font-medium">
                            <span>Subtotal ({b.duracion_horas}h)</span>
                            <span>${b.precio.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-on-surface-variant font-medium">
                            <span>Impuestos</span>
                            <span>$0.00</span>
                          </div>
                          <div className="pt-4 mt-4 border-t border-slate-200/60 flex justify-between font-extrabold text-xl text-on-surface">
                            <span>Total</span>
                            <span>${b.precio.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {reservasFiltradas.length === 0 && reservas.length > 0 && (
              <div className="text-center py-12 text-on-surface-variant">
                No hay reservas finalizadas aún.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal de Calificación */}
      <AnimatePresence>
        {ratingReserva && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-on-surface/40 backdrop-blur-sm p-0 md:p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-surface-lowest w-full md:max-w-lg rounded-t-[3rem] md:rounded-[3rem] p-8 md:p-10 shadow-ghost relative"
            >
              <button
                onClick={closeRating}
                className="absolute top-6 right-6 p-2 bg-surface-low rounded-full text-slate-400 hover:text-on-surface transition-colors"
              >
                <X size={20} />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">Califica tu servicio</h2>
                    <p className="text-on-surface-variant text-sm">
                      ¿Cómo fue tu experiencia con{' '}
                      <span className="font-bold text-on-surface">{ratingReserva.colaborador_nombre}</span>{' '}
                      el {ratingReserva.fecha}?
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 mb-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-2 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          size={40}
                          className={`transition-colors duration-200 ${
                            (hoveredRating || rating) >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-on-surface mb-3 ml-2">
                      Comentarios (Opcional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Cuéntanos qué te pareció el servicio..."
                      className="input-minimal resize-none h-32"
                    />
                  </div>

                  <button
                    onClick={handleSubmitRating}
                    disabled={rating === 0 || submittingRating}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      rating > 0
                        ? 'bg-primary text-white shadow-editorial active:scale-95'
                        : 'bg-surface-low text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {submittingRating && <Loader2 size={20} className="animate-spin" />}
                    {submittingRating ? 'Enviando...' : 'Enviar Calificación'}
                  </button>
                </>
              ) : (
                <div className="text-center py-12 animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-primary" />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-3">¡Gracias!</h2>
                  <p className="text-on-surface-variant">
                    Tu opinión nos ayuda a mantener el estándar de calidad de ServiClean.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
