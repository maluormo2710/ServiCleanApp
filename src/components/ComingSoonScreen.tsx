import React from 'react';
import { ArrowLeft, Clock, PenTool } from 'lucide-react';

interface ComingSoonScreenProps {
  onBack: () => void;
}

export const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-surface-lowest flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 z-10 bg-surface-lowest">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-low transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">ServiClean</h1>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-surface-low">
          <img src="https://i.pravatar.cc/150?u=user_admin" alt="Mi Perfil" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 text-center">
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          {/* Abstract background shapes */}
          <div className="absolute inset-0 bg-teal-50 rounded-[4rem] rotate-12 scale-110"></div>
          <div className="absolute inset-0 bg-teal-100/50 rounded-[3rem] -rotate-6 scale-105"></div>
          
          {/* White rounded square */}
          <div className="relative w-40 h-40 bg-white rounded-3xl shadow-sm flex items-center justify-center">
            <div className="relative">
              <PenTool size={64} className="text-primary" />
              <div className="absolute -top-2 -right-4 w-4 h-4 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
          Función en camino
        </h2>

        <p className="text-lg text-on-surface-variant mb-12 max-w-md leading-relaxed">
          Estamos puliendo los últimos detalles para brindarte la mejor experiencia de limpieza profesional.
        </p>

        <button 
          onClick={onBack}
          className="w-full max-w-sm bg-primary text-white py-4 rounded-full font-bold text-lg shadow-editorial hover:scale-105 active:scale-95 transition-transform mb-6"
        >
          Regresar al Inicio
        </button>

        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm tracking-wider uppercase">
          <Clock size={16} />
          <span>Disponible pronto</span>
        </div>
      </main>
    </div>
  );
};
