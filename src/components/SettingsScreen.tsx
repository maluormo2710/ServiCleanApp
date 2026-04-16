import React from 'react';
import { Bell, Smartphone, Mail, Tag } from 'lucide-react';
import { NotificationSettings } from '../types';

interface SettingsScreenProps {
  settings: NotificationSettings;
  setSettings: React.Dispatch<React.SetStateAction<NotificationSettings>>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, setSettings }) => {
  const toggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const options = [
    { id: 'push', icon: Bell, title: 'Notificaciones Push', desc: 'Recibe alertas sobre el estado de tus reservas en tu dispositivo.' },
    { id: 'email', icon: Mail, title: 'Correos Electrónicos', desc: 'Recibos, reportes y actualizaciones importantes a tu correo.' },
    { id: 'sms', icon: Smartphone, title: 'Mensajes SMS', desc: 'Alertas urgentes y recordatorios por mensaje de texto.' },
    { id: 'promos', icon: Tag, title: 'Promociones', desc: 'Ofertas exclusivas y descuentos de ServiClean.' },
  ];

  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">Configuración</h1>
        <p className="text-lg text-on-surface-variant">Gestiona tus preferencias y notificaciones.</p>
      </header>

      <div className="card-editorial space-y-8">
        <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Preferencias de Notificación</h3>
        
        <div className="space-y-6">
          {options.map(opt => (
            <div key={opt.id} className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center text-primary shrink-0">
                  <opt.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{opt.title}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{opt.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => toggle(opt.id as keyof NotificationSettings)}
                className={`w-14 h-8 rounded-full transition-colors relative shrink-0 ${settings[opt.id as keyof NotificationSettings] ? 'bg-primary' : 'bg-slate-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${settings[opt.id as keyof NotificationSettings] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
