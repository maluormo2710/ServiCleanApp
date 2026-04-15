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

export const WorkerProfile: React.FC<WorkerProfileProps> = ({ workerId, onBack, onAddBooking, addresses, paymentMethods }) => {
  const worker = dbColaboradores.find(w => w.id === workerId);
  const [bookingStep, setBookingStep] = useState(0); // 0: hidden, 1: schedule, 2: payment, 3: success
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    endTime: '',
    type: 'Limpieza General (Cocina y Baños)',
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
        tasks: ['Limpieza general'],
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

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="pt-24 px-8 max-w-4xl mx-auto"
      >
        <section className="mt-12 mb-16 flex flex-col md:flex-row gap-12 items-start">
          <motion.div variants={itemVariants} className="relative w-full md:w-1/3 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
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
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 space-y-6 pt-4">
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
              <button className="border-2 border-slate-200 text-on-surface px-8 py-4 rounded-full font-bold text-base hover:bg-surface-low transition-all flex items-center justify-center gap-3">
                <MessageCircle size={20} />
                Enviar Mensaje
              </button>
            </div>
          </motion.div>
        </section>

        <motion.section variants={itemVariants} className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            Sobre mí
          </h3>
          <div className="card-editorial">
            <p className="text-on-surface-variant leading-relaxed text-lg">
              {worker.bio}
            </p>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
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
        </motion.div>
      </motion.main>

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
                        onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
                        className="input-minimal appearance-none pr-10"
                      >
                        <option>Limpieza General (Cocina y Baños)</option>
                        <option>Aseo Profundo (Mudanza)</option>
                        <option>Organización de Espacios</option>
                        <option>Limpieza Estándar</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
                    Selecciona tu método de pago para confirmar la reserva.
                  </p>
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
    </div>
  );
};
