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
import { Address, PaymentMethod } from './types';
import { Menu, X } from 'lucide-react';
import { authStorage } from './services/api';

type Screen = 'login' | 'home' | 'worker-profile' | 'bookings' | 'notifications' | 'profile' | 'admin' | 'addresses' | 'payment-methods' | 'support' | 'settings' | 'chat' | 'promotions';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Restaurar sesión guardada al cargar la app
  useEffect(() => {
    const savedUser = authStorage.getUser();
    if (savedUser) {
      if (savedUser.rol === 'admin') setCurrentScreen('admin');
      else setCurrentScreen('home');
    }
  }, []);

  const handleLogin = (rol: string) => {
    if (rol === 'admin') setCurrentScreen('admin');
    else setCurrentScreen('home');
  };
  
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', name: 'Casa', fullAddress: 'Av. Siempre Viva 742, Springfield' }
  ]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', brand: 'Visa', last4: '4242', name: 'Mi Tarjeta Principal' }
  ]);

  const handleLogout = () => {
    authStorage.clear();
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onNavigateToComingSoon={() => setCurrentScreen('promotions')} />;
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
            onBookingSuccess={() => setCurrentScreen('bookings')}
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
        return <BookingsScreen onNavigateToReport={() => setCurrentScreen('promotions')} />;
      case 'notifications':
        return <NotificationsScreen />;
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
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      default:
        return <HomeScreen onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} />;
    }
  };

  const showHamburger = !['login', 'worker-profile', 'chat', 'promotions'].includes(currentScreen);
  const showAvatar = ['home', 'bookings', 'notifications', 'support'].includes(currentScreen);


  return (
    <div className="min-h-screen bg-background">

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
