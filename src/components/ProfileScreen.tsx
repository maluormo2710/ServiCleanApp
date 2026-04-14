import React from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Shield, ChevronRight, Edit2 } from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">Mi Perfil</h1>
          <p className="text-lg text-on-surface-variant">Gestiona tu información personal.</p>
        </div>
        <button className="w-12 h-12 bg-surface-low rounded-full flex items-center justify-center text-primary hover:bg-teal-50 transition-colors">
          <Edit2 size={20} />
        </button>
      </header>

      <div className="card-editorial flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="relative">
          <div className="w-32 h-32 bg-primary text-white rounded-[2rem] flex items-center justify-center text-4xl font-extrabold shadow-editorial">
            MP
          </div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white">
              <Shield size={16} />
            </div>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-on-surface mb-2">María Pérez</h2>
          <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2 mb-1">
            <Mail size={16} /> maria@ejemplo.com
          </p>
          <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2">
            <Phone size={16} /> +57 300 000 0000
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Accesos Rápidos</h3>
        
        <button 
          onClick={() => onNavigate('addresses')}
          className="w-full card-editorial p-6 flex items-center justify-between hover:bg-surface-low transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-primary">
              <MapPin size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Mis Direcciones</h4>
              <p className="text-sm text-on-surface-variant">Gestiona tus lugares de servicio</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => onNavigate('payment-methods')}
          className="w-full card-editorial p-6 flex items-center justify-between hover:bg-surface-low transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <CreditCard size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Métodos de Pago</h4>
              <p className="text-sm text-on-surface-variant">Tarjetas y facturación</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-slate-300 group-hover:text-primary transition-colors" />
        </button>
      </div>
    </div>
  );
};
