import React, { useState } from 'react';
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
import { Booking, Address, PaymentMethod } from './types';
import { Menu } from 'lucide-react';

type Screen = 'login' | 'home' | 'worker-profile' | 'bookings' | 'notifications' | 'profile' | 'admin' | 'addresses' | 'payment-methods' | 'support' | 'settings';

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
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} />;
      case 'worker-profile':
        if (selectedWorkerId) {
          return <WorkerProfile 
            workerId={selectedWorkerId} 
            onBack={() => setCurrentScreen('home')} 
            onAddBooking={handleAddBooking}
            addresses={addresses}
            paymentMethods={paymentMethods}
          />;
        }
        return <HomeScreen onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} />;
      case 'bookings':
        return <BookingsScreen bookings={bookings} setBookings={setBookings} />;
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
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      default:
        return <HomeScreen onSelectWorker={(id) => { setSelectedWorkerId(id); setCurrentScreen('worker-profile'); }} />;
    }
  };

  const showHamburger = !['login', 'worker-profile'].includes(currentScreen);
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
      
      {currentScreen !== 'login' && currentScreen !== 'worker-profile' && (
        <BottomNav activeTab={currentScreen} onTabChange={(screen) => setCurrentScreen(screen as Screen)} />
      )}
    </div>
  );
}
