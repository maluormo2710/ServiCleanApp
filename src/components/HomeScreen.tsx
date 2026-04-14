import React from 'react';
import { dbColaboradores } from '../data';
import { Avatar } from './Avatar';
import { Star, MapPin, Search } from 'lucide-react';

export const HomeScreen: React.FC<{ onSelectWorker: (id: number) => void }> = ({ onSelectWorker }) => {
  return (
    <div className="pb-32">
      <header className="pt-20 px-8 mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight">
          Encuentra la frescura <br />
          <span className="text-primary">que tu hogar merece.</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mb-10 leading-relaxed">
          Reserva profesionales verificados para una limpieza profunda y garantizada en minutos.
        </p>

        <div className="bg-white p-2 rounded-[2.5rem] shadow-editorial flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-full bg-surface-low w-full">
            <Search size={20} className="text-primary" />
            <input 
              type="text" 
              placeholder="¿Qué necesitas limpiar?" 
              className="bg-transparent border-none p-0 text-base font-semibold focus:ring-0 placeholder:text-slate-400 w-full"
            />
          </div>
          <button className="btn-primary w-full md:w-auto">
            Buscar
          </button>
        </div>
      </header>

      <section className="px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Limpiadores Disponibles</h2>
          <button className="text-sm font-semibold text-primary hover:underline">
            Ver mapa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dbColaboradores.map((worker) => (
            <div 
              key={worker.id}
              onClick={() => onSelectWorker(worker.id)}
              className="bg-white rounded-[2rem] p-6 flex items-start gap-6 hover:shadow-ghost transition-all cursor-pointer group"
            >
              <Avatar 
                src={worker.avatarUrl} 
                name={worker.nombre} 
                className="w-24 h-24 rounded-2xl flex-shrink-0"
              />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                    {worker.nombre}
                  </h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-black text-amber-700">{worker.calificacion}</span>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-1">
                  {worker.especialidad}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-primary">${worker.tarifaHora}</span>
                    <span className="text-xs font-medium text-slate-400">/hr</span>
                  </div>
                  <button className="text-primary text-xs font-bold px-4 py-2 rounded-full bg-surface-low hover:bg-primary/10 transition-colors">
                    Ver Perfil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
