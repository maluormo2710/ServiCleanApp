import React, { useState } from 'react';
import { TrendingUp, Users, Wallet, Bell, Star, ArrowUpRight, Search, Filter } from 'lucide-react';
import { Avatar } from './Avatar';

const mockAdminBookings = [
  { id: 'RES-001', date: '2023-10-25', time: '10:00 AM', worker: 'Elena Rodriguez', client: 'Juan Perez', status: 'Completada', amount: '$55.00' },
  { id: 'RES-002', date: '2023-10-26', time: '02:00 PM', worker: 'Sofia Mendez', client: 'Maria Garcia', status: 'Pendiente', amount: '$40.00' },
  { id: 'RES-003', date: '2023-10-26', time: '09:00 AM', worker: 'Lucia Velez', client: 'Carlos Lopez', status: 'Confirmada', amount: '$65.00' },
  { id: 'RES-004', date: '2023-10-27', time: '11:00 AM', worker: 'Elena Rodriguez', client: 'Ana Martinez', status: 'Cancelada', amount: '$55.00' },
  { id: 'RES-005', date: '2023-10-28', time: '03:00 PM', worker: 'Sofia Mendez', client: 'Luis Torres', status: 'Pendiente', amount: '$80.00' },
];

export const AdminDashboard: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [workerFilter, setWorkerFilter] = useState('');

  const filteredBookings = mockAdminBookings.filter(booking => {
    const matchDate = dateFilter ? booking.date === dateFilter : true;
    const matchStatus = statusFilter ? booking.status === statusFilter : true;
    const matchWorker = workerFilter ? booking.worker.toLowerCase().includes(workerFilter.toLowerCase()) : true;
    return matchDate && matchStatus && matchWorker;
  });

  const kpis = [
    { label: 'Total Reservas (Mes)', value: '1,482', trend: '+12.5%', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Usuarios Activos', value: '8,290', trend: '42 nuevos hoy', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ingresos Retenidos', value: '$14,500', trend: 'En custodia', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 fixed h-full bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col">
        <div className="text-2xl font-black text-primary mb-12">ServiClean</div>
        <nav className="space-y-2 flex-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-editorial">
            <TrendingUp size={20} />
            Métricas
          </a>
          {['Limpiadores', 'Clientes', 'Finanzas', 'Configuración'].map(item => (
            <a key={item} href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-surface-low rounded-xl transition-colors">
              <div className="w-5 h-5 rounded bg-slate-100" />
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tighter">Dashboard Operativo</h1>
            <p className="text-on-surface-variant text-sm mt-1">Resumen de métricas y rendimiento del sistema.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-surface-low rounded-full transition-colors">
              <Bell size={24} />
            </button>
            <Avatar name="Admin" className="w-10 h-10 border-2 border-primary/20" />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card-editorial relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bg} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`} />
              <p className="text-[1rem] font-bold uppercase tracking-wider text-slate-400 mb-2">{kpi.label}</p>
              <h2 className={`text-4xl font-extrabold tracking-tighter ${kpi.color}`}>{kpi.value}</h2>
              <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-xs">
                <ArrowUpRight size={14} />
                <span>{kpi.trend}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-8 card-editorial bg-surface-low">
            <h3 className="text-2xl font-bold mb-8">Reservas Diarias</h3>
            <div className="flex items-end justify-between h-64 gap-4 px-4">
              {[40, 65, 55, 90, 45, 30, 20].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-4 w-full">
                  <div 
                    className={`w-full rounded-t-xl transition-all ${i === 3 ? 'bg-primary shadow-editorial' : 'bg-teal-100'}`} 
                    style={{ height: `${h}%` }} 
                  />
                  <span className="text-[1rem] font-bold text-slate-400 uppercase">
                    {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 card-editorial">
            <h3 className="text-xl font-bold mb-8">Top Colaboradoras</h3>
            <div className="space-y-6">
              {[
                { name: 'Elena Rodriguez', count: 92, rate: 4.9 },
                { name: 'Sofia Mendez', count: 85, rate: 4.8 },
                { name: 'Lucia Velez', count: 78, rate: 4.7 },
              ].map((w) => (
                <div key={w.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar name={w.name} className="w-12 h-12" />
                    <div>
                      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{w.name}</p>
                      <p className="text-[1rem] text-slate-400 font-medium">{w.count} Reservas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{w.rate}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-surface-low text-slate-500 text-[1rem] font-bold uppercase tracking-widest rounded-2xl hover:bg-teal-50 hover:text-primary transition-all">
              Ver Ranking Completo
            </button>
          </div>
        </div>

        {/* Bookings Management Section */}
        <section className="card-editorial">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold">Gestión de Reservas</h3>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar trabajador..." 
                  value={workerFilter}
                  onChange={(e) => setWorkerFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="py-2 px-4 bg-surface-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
              />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-4 bg-surface-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-bold">ID Reserva</th>
                  <th className="pb-4 font-bold">Fecha y Hora</th>
                  <th className="pb-4 font-bold">Trabajador</th>
                  <th className="pb-4 font-bold">Cliente</th>
                  <th className="pb-4 font-bold">Monto</th>
                  <th className="pb-4 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-50 hover:bg-surface-low/50 transition-colors">
                    <td className="py-4 font-bold text-on-surface">{booking.id}</td>
                    <td className="py-4 text-on-surface-variant">{booking.date} • {booking.time}</td>
                    <td className="py-4 font-medium">{booking.worker}</td>
                    <td className="py-4 text-on-surface-variant">{booking.client}</td>
                    <td className="py-4 font-bold">{booking.amount}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Completada' ? 'bg-teal-50 text-teal-700' :
                        booking.status === 'Confirmada' ? 'bg-blue-50 text-blue-700' :
                        booking.status === 'Pendiente' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No se encontraron reservas con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
