import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Shield, ChevronRight, Edit2, Check, X } from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'María Pérez',
    email: 'maria@ejemplo.com',
    phone: '+57 300 000 0000'
  });
  const [editData, setEditData] = useState({ ...profileData });

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">Mi Perfil</h1>
          <p className="text-lg text-on-surface-variant">Gestiona tu información personal.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="w-12 h-12 bg-surface-low rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
              <button onClick={handleSave} className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-editorial hover:scale-105 transition-transform">
                <Check size={20} />
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-12 h-12 bg-surface-low rounded-full flex items-center justify-center text-primary hover:bg-teal-50 transition-colors">
              <Edit2 size={20} />
            </button>
          )}
        </div>
      </header>

      <div className="card-editorial flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="relative">
          <div className="w-32 h-32 bg-primary text-white rounded-[2rem] flex items-center justify-center text-4xl font-extrabold shadow-editorial">
            {profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white">
              <Shield size={16} />
            </div>
          </div>
        </div>
        <div className="text-center md:text-left w-full max-w-md">
          {isEditing ? (
            <div className="space-y-4">
              <input 
                type="text" 
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="w-full text-2xl font-bold text-on-surface bg-surface-low border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20"
                placeholder="Nombre completo"
              />
              <div className="flex items-center gap-2 bg-surface-low rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20">
                <Mail size={16} className="text-slate-400" />
                <input 
                  type="email" 
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full bg-transparent border-none p-0 text-on-surface focus:ring-0"
                  placeholder="Correo electrónico"
                />
              </div>
              <div className="flex items-center gap-2 bg-surface-low rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20">
                <Phone size={16} className="text-slate-400" />
                <input 
                  type="tel" 
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full bg-transparent border-none p-0 text-on-surface focus:ring-0"
                  placeholder="Número de teléfono"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-on-surface mb-2">{profileData.name}</h2>
              <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2 mb-1">
                <Mail size={16} /> {profileData.email}
              </p>
              <p className="text-on-surface-variant flex items-center justify-center md:justify-start gap-2">
                <Phone size={16} /> {profileData.phone}
              </p>
            </>
          )}
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
