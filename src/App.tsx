import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HomeScreen } from './components/HomeScreen';
import { WorkerProfile } from './components/WorkerProfile';
import { LoginScreen } from './components/LoginScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { BookingsScreen } from './components/BookingsScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { AddressesScreen } from './components/AddressesScreen';
import { PaymentMethodsScreen } from './components/PaymentMethodsScreen';
import { SupportScreen } from './components/SupportScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ChatScreen } from './components/ChatScreen';
import { ComingSoonScreen } from './components/ComingSoonScreen';
import { Booking, Address, PaymentMethod, AppNotification, NotificationSettings } from './types';
import { Menu, X, Sparkles, Clock, CreditCard, Bell } from 'lucide-react';

type Screen = 'login' | 'home' | 'worker-profile' | 'bookings' | 'notifications' | 'profile' | 'admin' | 'addresses' | 'payment-methods' | 'support' | 'settings' | 'chat' | 'promotions';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', name: 'Casa', fullAddress: 'Av. Siempre Viva 742, Springfield' }
  ]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', brand: 'Visa', last4: '4242', name: 'Mi Tarjeta Principal' }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false,
    promos: true
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: '¡Reserva Confirmada!',
      desc: 'Tu servicio de limpieza profunda para mañana a las 09:00 AM ha sido asignado a Elena Gómez.',
      time: 'Hace 5 min',
      iconType: 'sparkles',
      color: 'bg-primary-light',
      unread: true
    },
    {
      id: '2',
      title: 'Recordatorio',
      desc: 'No olvides calificar tu último servicio realizado el pasado martes. Tu opinión nos ayuda a mejorar.',
      time: 'Hace 2 horas',
      iconType: 'clock',
      color: 'bg-surface-low',
      unread: false
    },
    {
      id: '3',
      title: 'Pago Procesado',
      desc: 'Hemos recibido correctamente el pago de tu suscripción mensual Premium.',
      time: 'Ayer',
      iconType: 'credit-card',
      color: 'bg-surface-low',
      unread: false
    }
  ]);

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const triggerPushNotification = (notification: Omit<AppNotification, 'id' | 'time' | 'unread'>) => {
    if (!notificationSettings.push) return; // Do not show if push is disabled
    
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Ahora mismo',
      unread: true
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setActiveToast(newNotification);
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 3,
      date: '10 Nov 2023',
      time: '10:00 AM',
      type: 'Limpieza Estándar',
      worker: 'Elena Valdez',
      price: '$165.00',
      status: 'Completado',
      rated: false,
      details: {
        duration: '3h',
        address: 'Av. Siempre Viva 742',
        tasks: ['Limpieza general', 'Planchado'],
        subtotal: '$165.00',
        tax: '$0.00'
      }
    },
    {
      id: 1,
      date: '15 Oct 2023',
      time: '09:00 AM',
      type: 'Limpieza Profunda',
      worker: 'Ana Martínez',
      price: '$200.00',
      status: 'Completado',
      rated: true,
      details: {
        duration: '4h',
        address: 'Av. Siempre Viva 742',
        tasks: ['Limpieza de ventanas', 'Desinfección de baños', 'Aspirado profundo'],
        subtotal: '$200.00',
        tax: '$0.00'
      }
    },
    {
      id: 2,
      date: '22 Oct 2023',
      time: '02:00 PM',
      type: 'Limpieza Estándar',
      worker: 'Carlos Gómez',
      price: '$130.00',
      status: 'Cancelado',
      rated: false,
      details: {
        duration: '2h',
        address: 'Av. Siempre Viva 742',
        tasks: ['Limpieza general', 'Sacudir polvo'],
        subtotal: '$130.00',
        tax: '$0.00'
      }
    }
  ]);

  const handleAddBooking = (newBookingData: any) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: Date.now(),
    };
    setBookings([newBooking, ...bookings]);
    setCurrentScreen('bookings');
    
    // Trigger push notification for booking confirmation
    triggerPushNotification({
      title: '¡Reserva Confirmada!',
      desc: `Tu servicio con ${newBooking.worker} ha sido agendado para el ${newBooking.date} a las ${newBooking.time}.`,
      iconType: 'sparkles',
      color: 'bg-primary-light'
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('home')} onNavigateToComingSoon={() => setCurrentScreen('promotions')} />;
      case 'home':
        return <HomeScreen 
          onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} 
          onNavigateToMap={() => setCurrentScreen('promotions')}
        />;
      case 'worker-profile':
        if (selectedWorkerId) {
          return <WorkerProfile 
            workerId={selectedWorkerId} 
            onBack={() => setCurrentScreen('home')} 
            onAddBooking={handleAddBooking}
            addresses={addresses}
            paymentMethods={paymentMethods}
            onNavigateToChat={(id) => { setSelectedWorkerId(id); setCurrentScreen('chat'); }}
          />;
        }
        return <HomeScreen 
          onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} 
          onNavigateToMap={() => setCurrentScreen('promotions')}
        />;
      case 'chat':
        if (selectedWorkerId) {
          return <ChatScreen workerId={selectedWorkerId} onBack={() => setCurrentScreen('worker-profile')} />;
        }
        return <HomeScreen 
          onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} 
          onNavigateToMap={() => setCurrentScreen('promotions')}
        />;
      case 'bookings':
        return <BookingsScreen bookings={bookings} setBookings={setBookings} onNavigateToReport={() => setCurrentScreen('promotions')} />;
      case 'notifications':
        return <NotificationsScreen notifications={notifications} />;
      case 'admin':
        return <AdminDashboard />;
      case 'addresses':
        return <AddressesScreen addresses={addresses} setAddresses={setAddresses} />;
      case 'payment-methods':
        return <PaymentMethodsScreen paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} />;
      case 'support':
        return <SupportScreen />;
      case 'promotions':
        return <ComingSoonScreen onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen settings={notificationSettings} setSettings={setNotificationSettings} />;
      case 'profile':
        return <ProfileScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      default:
        return <HomeScreen onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} />;
    }
  };

  const showHamburger = !['login', 'worker-profile', 'chat', 'promotions'].includes(currentScreen);
  const showAvatar = ['home', 'bookings', 'notifications', 'support'].includes(currentScreen);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'sparkles': return <Sparkles size={20} className="text-white" />;
      case 'clock': return <Clock size={20} className="text-white" />;
      case 'credit-card': return <CreditCard size={20} className="text-white" />;
      default: return <Bell size={20} className="text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notification */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-4 border border-slate-100"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeToast.color}`}>
              {renderIcon(activeToast.iconType)}
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-bold text-on-surface text-sm">{activeToast.title}</h4>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{activeToast.desc}</p>
            </div>
            <button onClick={() => setActiveToast(null)} className="p-1 text-slate-400 hover:text-on-surface">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showHamburger && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-6 left-6 z-40 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-editorial text-primary hover:bg-surface-low transition-colors"
        >
          <Menu size={24} />
        </button>
      )}

      {showAvatar && (
        <button 
          onClick={() => setCurrentScreen('profile')}
          className="fixed top-6 right-6 z-40 w-12 h-12 rounded-full border-2 border-white shadow-editorial overflow-hidden hover:scale-105 transition-transform bg-surface-low"
        >
          <img src="https://i.pravatar.cc/150?u=user_admin" alt="Mi Perfil" className="w-full h-full object-cover" />
        </button>
      )}
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={(screen) => setCurrentScreen(screen as Screen)} 
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      
      {currentScreen !== 'login' && currentScreen !== 'worker-profile' && currentScreen !== 'chat' && currentScreen !== 'promotions' && (
        <BottomNav activeTab={currentScreen} onTabChange={(screen) => setCurrentScreen(screen as Screen)} />
      )}
    </div>
  );
}
