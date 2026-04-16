import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dbColaboradores } from '../data';
import { Avatar } from './Avatar';
import { Star, MapPin, ArrowLeft, Verified, ShieldCheck, Calendar, MessageCircle, X, CreditCard, CheckCircle, ChevronDown } from 'lucide-react';
import { Address, PaymentMethod } from '../types';

interface WorkerProfileProps {
  workerId: number;
  onBack: () => void;
  onAddBooking: (booking: any) => void;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  onNavigateToChat: (workerId: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const SERVICE_TYPES = [
  {
    name: 'Limpieza General (Cocina y Baños)',
    tasks: ['Barrer y trapear', 'Limpiar polvo', 'Limpieza de baños', 'Limpieza de cocina', 'Sacar basura']
  },
  {
    name: 'Aseo Profundo (Mudanza)',
    tasks: ['Limpieza interior de electrodomésticos', 'Limpieza de zócalos', 'Desinfección profunda', 'Limpieza de ventanas interiores', 'Remoción de sarro']
  },
  {
    name: 'Organización de Espacios',
    tasks: ['Organización de clósets', 'Clasificación de objetos', 'Organización de despensa', 'Doblado de ropa']
  },
  {
    name: 'Limpieza Post-Construcción',
    tasks: ['Remoción de escombros finos', 'Limpieza de polvo de obra', 'Eliminación de manchas de pintura', 'Limpieza profunda de pisos']
  },
  {
    name: 'Mantenimiento de Exteriores',
    tasks: ['Limpieza de terrazas', 'Barrido de hojas', 'Limpieza de muebles de exterior', 'Lavado de fachada básica']
  },
  {
    name: 'Cuidado de Superficies Premium',
    tasks: ['Pulido de mármol', 'Cuidado de madera fina', 'Limpieza de tapicería delicada', 'Tratamiento de granito']
  }
];

export const WorkerProfile: React.FC<WorkerProfileProps> = ({ workerId, onBack, onAddBooking, addresses, paymentMethods, onNavigateToChat }) => {
  const worker = dbColaboradores.find(w => w.id === workerId);
  
  // Find a service type that matches the worker's specialty, or default to the first one
  const defaultServiceType = SERVICE_TYPES.find(s => worker?.especialidad.includes(s.name) || s.name.includes(worker?.especialidad || '')) || SERVICE_TYPES[0];

  const [bookingStep, setBookingStep] = useState(0); // 0: hidden, 1: schedule, 2: payment, 3: success
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    endTime: '',
    type: defaultServiceType.name,
    tasks: [] as string[],
    comments: '',
    address: addresses.length > 0 ? addresses[0].fullAddress : '',
    paymentMethodId: paymentMethods.length > 0 ? paymentMethods[0].id : ''
  });

  if (!worker) return null;

  const calculateTimeDiffInHours = () => {
    if (!bookingData.time || !bookingData.endTime) return 0;
    const [startH, startM] = bookingData.time.split(':').map(Number);
    const [endH, endM] = bookingData.endTime.split(':').map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff <= 0) return 0;
    return diff / 60;
  };

  const calculateDuration = () => {
    const hoursDecimal = calculateTimeDiffInHours();
    if (hoursDecimal <= 0) return 'Por definir';
    const totalMins = Math.round(hoursDecimal * 60);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
  };

  const calculatePrice = () => {
    const hours = calculateTimeDiffInHours();
    if (hours <= 0) return worker.tarifaHora; // Fallback a 1 hora
    return hours * worker.tarifaHora;
  };

  const calculatedPrice = calculatePrice();
  const formattedPrice = `$${calculatedPrice.toFixed(2)}`;

  const handleConfirmBooking = () => {
    // Move to success step
    setBookingStep(3);
  };

  const handleFinishBooking = () => {
    const duration = calculateDuration();
    // Add booking to global state and close modal
    onAddBooking({
      date: bookingData.date || 'Próximamente',
      time: bookingData.time || 'Por definir',
      type: bookingData.type,
      worker: worker.nombre,
      price: formattedPrice,
      status: 'Agendado',
      rated: false,
      details: {
        duration: duration,
        address: bookingData.address,
        tasks: bookingData.tasks.length > 0 ? bookingData.tasks : ['Limpieza general'],
        comments: bookingData.comments,
        subtotal: formattedPrice,
        tax: '$0.00'
      }
    });
    setBookingStep(0);
  };

  return (
    <div className="pb-32 min-h-screen bg-background">
      <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-surface-low rounded-full transition-colors">
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <h2 className="text-xl font-bold text-primary tracking-tighter">Perfil del Colaborador</h2>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      <main className="pt-24 px-8 max-w-4xl mx-auto">
        <section className="mt-12 mb-16 flex flex-col md:flex-row gap-12 items-start">
          <div className="relative w-full md:w-1/3 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            <Avatar 
              src={worker.avatarUrl} 
              name={worker.nombre} 
              className="w-full h-full rounded-[2rem]"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-primary font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                Disponible ahora
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[1rem] font-bold uppercase tracking-wider">Top Rated</span>
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star size={16} className="fill-amber-600" />
                  <span className="text-lg">{worker.calificacion}</span>
                  <span className="text-on-surface-variant font-normal text-sm">({worker.serviciosCompletados} reseñas)</span>
                </div>
              </div>
              <span className="text-primary font-semibold tracking-widest text-[1.1rem] uppercase">
                {worker.especialidad}
              </span>
              <h1 className="text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
                {worker.nombre}
              </h1>
              <p className="text-on-surface-variant flex items-center gap-2 font-medium">
                <MapPin size={20} className="text-primary" />
                Bogotá, Colombia (Zona Norte)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setBookingStep(1)}
                className="btn-primary flex items-center justify-center gap-3"
              >
                <Calendar size={20} />
                Reservar Servicio
              </button>
              <button 
                onClick={() => onNavigateToChat(worker.id)}
                className="border-2 border-slate-200 text-on-surface px-8 py-4 rounded-full font-bold text-base hover:bg-surface-low transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                Enviar Mensaje
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            Sobre mí
          </h3>
          <div className="card-editorial">
            <p className="text-on-surface-variant leading-relaxed text-lg">
              {worker.bio}
            </p>
          </div>
        </section>

        {/* Galería de Trabajos */}
        {worker.galeria && worker.galeria.length > 0 && (
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Trabajos Anteriores
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory no-scrollbar">
              {worker.galeria.map((imgUrl, index) => (
                <div key={index} className="min-w-[250px] md:min-w-[300px] h-[180px] md:h-[220px] rounded-2xl overflow-hidden snap-center shrink-0 shadow-sm border border-slate-100">
                  <img src={imgUrl} alt={`Trabajo de ${worker.nombre} ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Verified size={20} className="text-primary" />
              Habilidades y Especialidades
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Planchado', 'Limpieza profunda', 'Organización', 'Desinfección'].map(skill => (
                <span key={skill} className="bg-surface-low text-on-surface px-5 py-2.5 rounded-full text-sm font-medium border border-slate-100">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl flex items-center gap-4">
              <ShieldCheck size={24} className="text-primary" />
              <p className="text-sm font-semibold text-primary">Identidad verificada y antecedentes consultados</p>
            </div>
          </div>

          <div className="bg-primary text-white p-8 rounded-[2rem] flex flex-col justify-between">
            <div>
              <h3 className="opacity-80 text-sm font-bold uppercase tracking-widest">Servicios completados</h3>
              <p className="text-5xl font-black mt-2">{worker.serviciosCompletados}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium leading-tight">Cliente frecuente promedio: 92%</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2">
                <div className="bg-white h-full rounded-full w-[92%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reseñas Section */}
        {worker.resenas && worker.resenas.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                Reseñas de Clientes
              </h3>
              <button 
                onClick={() => setShowReviewsModal(true)}
                className="text-primary font-bold text-sm hover:underline"
              >
                Ver todas
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {worker.resenas.map((resena) => (
                <div key={resena.id} className="bg-surface-low p-6 rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {resena.autor.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{resena.autor}</h4>
                        <span className="text-xs text-slate-400">{resena.fecha}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{resena.calificacion}</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm italic leading-relaxed">
                    "{resena.comentario}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Booking Flow Modal */}
      <AnimatePresence>
        {bookingStep > 0 && (
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-surface-lowest w-full md:max-w-lg rounded-t-[3rem] md:rounded-[3rem] p-8 md:p-10 shadow-ghost relative max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {bookingStep < 3 && (
                <button 
                  onClick={() => setBookingStep(0)}
                  className="absolute top-6 right-6 p-2 bg-surface-low rounded-full text-slate-400 hover:text-on-surface transition-colors"
                >
                  <X size={20} />
                </button>
              )}

            {/* Step 1: Schedule */}
            {bookingStep === 1 && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Agendar Servicio</h2>
                  <p className="text-on-surface-variant text-sm">
                    Selecciona la fecha y hora para tu servicio con <span className="font-bold text-on-surface">{worker.nombre}</span>.
                  </p>
                </div>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Tipo de Servicio</label>
                    <div className="relative">
                      <select 
                        value={bookingData.type}
                        onChange={(e) => {
                          setBookingData({
                            ...bookingData, 
                            type: e.target.value,
                            tasks: [] // Reset tasks when service type changes
                          });
                        }}
                        className="input-minimal appearance-none pr-10"
                      >
                        {SERVICE_TYPES.map(service => (
                          <option key={service.name} value={service.name}>{service.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tareas del Servicio */}
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Tareas a realizar</label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_TYPES.find(s => s.name === bookingData.type)?.tasks.map(task => {
                        const isSelected = bookingData.tasks.includes(task);
                        return (
                          <button
                            key={task}
                            onClick={() => {
                              setBookingData(prev => ({
                                ...prev,
                                tasks: isSelected 
                                  ? prev.tasks.filter(t => t !== task)
                                  : [...prev.tasks, task]
                              }));
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                              isSelected 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-surface-low text-on-surface-variant border-transparent hover:border-slate-200'
                            }`}
                          >
                            {task}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Fecha</label>
                    <input 
                      type="date" 
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      className="input-minimal"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Hora de Inicio</label>
                      <input 
                        type="time" 
                        value={bookingData.time}
                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                        className="input-minimal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Hora de Fin</label>
                      <input 
                        type="time" 
                        value={bookingData.endTime}
                        onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                        className="input-minimal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Dirección</label>
                    {addresses.length > 0 ? (
                      <div className="relative">
                        <select 
                          value={bookingData.address}
                          onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                          className="input-minimal appearance-none pr-10"
                        >
                          <option value="">Selecciona una dirección</option>
                          {addresses.map(a => (
                            <option key={a.id} value={a.fullAddress}>{a.name} - {a.fullAddress}</option>
                          ))}
                        </select>
                        <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600 bg-amber-50 p-4 rounded-2xl">No tienes direcciones guardadas. Ve al menú para agregar una.</p>
                    )}
                  </div>

                  {/* Comentarios */}
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Comentarios para el colaborador (Opcional)</label>
                    <textarea 
                      value={bookingData.comments}
                      onChange={(e) => setBookingData({...bookingData, comments: e.target.value})}
                      placeholder="Ej. El timbre no funciona, por favor llamar al llegar..."
                      className="input-minimal resize-none h-24"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setBookingStep(2)}
                  disabled={!bookingData.date || !bookingData.time || !bookingData.endTime || !bookingData.address}
                  className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                    bookingData.date && bookingData.time && bookingData.endTime && bookingData.address
                      ? 'bg-primary text-white shadow-editorial active:scale-95' 
                      : 'bg-surface-low text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continuar al Pago
                </button>
              </>
            )}

            {/* Step 2: Payment */}
            {bookingStep === 2 && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">Pago Seguro</h2>
                  <p className="text-on-surface-variant text-sm">
                    Revisa los detalles y selecciona tu método de pago.
                  </p>
                </div>

                {/* Resumen del Servicio */}
                <div className="mb-8 space-y-4">
                  <h3 className="font-bold text-on-surface">Resumen del Servicio</h3>
                  <div className="bg-surface-low p-5 rounded-2xl space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Tipo</span>
                      <span className="font-bold text-right">{bookingData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Fecha y Hora</span>
                      <span className="font-bold text-right">{bookingData.date} • {bookingData.time} - {bookingData.endTime}</span>
                    </div>
                    {bookingData.tasks.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-on-surface-variant block mb-2">Tareas seleccionadas:</span>
                        <div className="flex flex-wrap gap-1">
                          {bookingData.tasks.map((t, i) => (
                            <span key={i} className="px-2 py-1 bg-white rounded-md text-xs font-semibold text-slate-600">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {bookingData.comments && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <span className="text-on-surface-variant block mb-1">Comentarios:</span>
                        <span className="font-medium italic text-slate-600">"{bookingData.comments}"</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-surface-low p-6 rounded-3xl mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total a Pagar</p>
                    <p className="text-3xl font-extrabold text-primary">{formattedPrice}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                    <CreditCard size={24} />
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Método de Pago</label>
                    {paymentMethods.length > 0 ? (
                      <select 
                        value={bookingData.paymentMethodId}
                        onChange={(e) => setBookingData({...bookingData, paymentMethodId: e.target.value})}
                        className="input-minimal appearance-none"
                      >
                        <option value="">Selecciona un método de pago</option>
                        {paymentMethods.map(p => (
                          <option key={p.id} value={p.id}>{p.brand} terminada en {p.last4}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-amber-600 bg-amber-50 p-4 rounded-2xl">No tienes métodos de pago guardados. Ve al menú para agregar uno.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setBookingStep(1)}
                    className="w-1/3 py-4 rounded-full font-bold text-lg bg-surface-low text-on-surface hover:bg-slate-200 transition-colors"
                  >
                    Volver
                  </button>
                  <button 
                    onClick={handleConfirmBooking}
                    disabled={!bookingData.paymentMethodId}
                    className={`w-2/3 py-4 rounded-full font-bold text-lg transition-transform ${
                      bookingData.paymentMethodId
                      ? 'bg-primary text-white shadow-editorial active:scale-95'
                      : 'bg-surface-low text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Confirmar y Pagar
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Success */}
            {bookingStep === 3 && (
              <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} className="text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-3">¡Reserva Confirmada!</h2>
                <p className="text-on-surface-variant mb-10">
                  Tu servicio con {worker.nombre} ha sido agendado exitosamente para el {bookingData.date} a las {bookingData.time}.
                </p>
                <button 
                  onClick={handleFinishBooking}
                  className="w-full py-4 rounded-full font-bold text-lg bg-primary text-white shadow-editorial active:scale-95 transition-transform"
                >
                  Ver mis reservas
                </button>
              </div>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviewsModal && (
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-surface-lowest w-full md:max-w-2xl rounded-t-[3rem] md:rounded-[3rem] p-8 md:p-10 shadow-ghost relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setShowReviewsModal(false)}
                className="absolute top-6 right-6 p-2 bg-surface-low rounded-full text-slate-400 hover:text-on-surface transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8 shrink-0">
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Reseñas de Clientes</h2>
                <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-xl">
                  <Star size={24} className="fill-amber-600" />
                  <span>{worker.calificacion}</span>
                  <span className="text-on-surface-variant font-normal text-base">({worker.serviciosCompletados} reseñas)</span>
                </div>
              </div>

              {/* Rating Breakdown (Mocked for visual) */}
              <div className="mb-8 space-y-2 shrink-0">
                {[5, 4, 3, 2, 1].map((star, index) => {
                  // Mock percentages for visual effect based on overall rating
                  const percentages = [85, 10, 3, 1, 1];
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <span className="w-4 text-right font-bold text-slate-500">{star}</span>
                      <Star size={12} className="text-slate-400" />
                      <div className="flex-1 h-2 bg-surface-low rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${percentages[index]}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right text-slate-400 text-xs">{percentages[index]}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 no-scrollbar flex-1">
                {worker.resenas?.map((resena) => (
                  <div key={resena.id} className="bg-surface-low p-6 rounded-3xl border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {resena.autor.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{resena.autor}</h4>
                          <span className="text-xs text-slate-400">{resena.fecha}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">{resena.calificacion}</span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      "{resena.comentario}"
                    </p>
                  </div>
                ))}
                
                {/* Add some dummy extra reviews to make it scrollable if there are few */}
                {worker.resenas && worker.resenas.length < 5 && (
                  <>
                    <div className="bg-surface-low p-6 rounded-3xl border border-slate-100 opacity-70">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">A</div>
                          <div>
                            <h4 className="font-bold text-on-surface">Ana G.</h4>
                            <span className="text-xs text-slate-400">Hace 2 meses</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star size={14} className="fill-amber-500 text-amber-500" />
                          <span className="text-sm font-bold text-amber-700">5</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed">"Muy buen servicio, lo recomiendo ampliamente."</p>
                    </div>
                    <div className="bg-surface-low p-6 rounded-3xl border border-slate-100 opacity-70">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">C</div>
                          <div>
                            <h4 className="font-bold text-on-surface">Carlos M.</h4>
                            <span className="text-xs text-slate-400">Hace 3 meses</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star size={14} className="fill-amber-500 text-amber-500" />
                          <span className="text-sm font-bold text-amber-700">4.5</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed">"Todo perfecto, muy amable."</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
