import React, { useState } from 'react';
import { Mail, Lock, Apple, Smartphone, User, Phone } from 'lucide-react';

export const LoginScreen: React.FC<{ onLogin: () => void, onNavigateToComingSoon: () => void }> = ({ onLogin, onNavigateToComingSoon }) => {
  const [role, setRole] = useState<'cliente' | 'colaborador'>('cliente');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle registration/login logic here
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[120rem] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <section className="hidden lg:flex flex-col space-y-8 pr-12">
          <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-editorial">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000" 
              alt="Interior impecable y minimalista" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white max-w-sm">
              <span className="text-[1rem] font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-4 inline-block">
                Higiene Premium
              </span>
              <h2 className="text-4xl font-manrope font-extrabold tracking-tight leading-tight">
                El arte de un espacio impecable.
              </h2>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center lg:items-start space-y-10">
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <h1 className="text-5xl font-manrope font-extrabold text-primary tracking-tighter">
              ServiClean
            </h1>
            <p className="text-on-surface-variant text-lg text-center lg:text-left">
              {mode === 'login' 
                ? 'Bienvenido de nuevo. Accede a tu cuenta para gestionar tus servicios.' 
                : 'Únete a ServiClean. Crea tu cuenta y disfruta de espacios impecables.'}
            </p>
          </div>

          <div className="w-full max-w-md bg-white rounded-[3rem] p-8 shadow-editorial">
            <div className="bg-surface-low p-2 rounded-2xl flex mb-8 relative">
              <div 
                className={`absolute top-2 bottom-2 w-[calc(50%-0.5rem)] bg-white rounded-xl shadow-sm transition-all duration-300 ${
                  role === 'colaborador' ? 'left-[50%]' : 'left-2'
                }`}
              />
              <button 
                onClick={() => setRole('cliente')}
                className={`flex-1 py-3 text-sm font-manrope font-bold rounded-xl z-10 transition-colors ${
                  role === 'cliente' ? 'text-primary' : 'text-slate-400'
                }`}
              >
                Soy Cliente
              </button>
              <button 
                onClick={() => setRole('colaborador')}
                className={`flex-1 py-3 text-sm font-manrope font-bold rounded-xl z-10 transition-colors ${
                  role === 'colaborador' ? 'text-primary' : 'text-slate-400'
                }`}
              >
                Soy Colaborador
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="text-[1.1rem] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="input-minimal pr-12" 
                        placeholder="Ej. María Pérez"
                        required
                      />
                      <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>
                  <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="text-[1.1rem] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        className="input-minimal pr-12" 
                        placeholder="+57 300 000 0000"
                        required
                      />
                      <Phone size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[1.1rem] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    className="input-minimal pr-12" 
                    placeholder="nombre@ejemplo.com"
                    required
                  />
                  <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[1.1rem] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="input-minimal pr-12" 
                    placeholder="••••••••"
                    required
                  />
                  <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
                {mode === 'login' && (
                  <div className="text-right mt-2">
                    <button 
                      type="button"
                      onClick={onNavigateToComingSoon} 
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary w-full text-lg">
                {mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 h-[1px] bg-slate-100"></div>
              <span className="px-4 text-[1rem] font-bold text-slate-300 uppercase tracking-widest">o continúa con</span>
              <div className="flex-1 h-[1px] bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={onNavigateToComingSoon}
                className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-xl hover:bg-surface-low transition-colors"
              >
                <Smartphone size={20} className="text-on-surface" />
                <span className="text-sm font-bold">Google</span>
              </button>
              <button 
                type="button"
                onClick={onNavigateToComingSoon}
                className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-xl hover:bg-surface-low transition-colors"
              >
                <Apple size={20} className="text-on-surface" />
                <span className="text-sm font-bold">Apple</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant">
            {mode === 'login' ? (
              <>
                ¿Aún no tienes cuenta?{' '}
                <button 
                  onClick={() => setMode('register')} 
                  className="text-primary font-bold hover:underline"
                >
                  Regístrate ahora
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-primary font-bold hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </section>
      </div>
    </div>
  );
};
