import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Wallet, Bell, Star, ArrowUpRight, Search, Loader2, ShieldOff, ShieldCheck } from 'lucide-react';
import { Avatar } from './Avatar';
import { api, MetricasOut, ReservaOut, UsuarioOut } from '../services/api';

type AdminTab = 'metricas' | 'reservas' | 'usuarios';

const estadoBadge: Record<string, string> = {
  Finalizado:  'bg-teal-50 text-teal-700',
  Confirmada:  'bg-blue-50 text-blue-700',
  'En Curso':  'bg-violet-50 text-violet-700',
  Pendiente:   'bg-amber-50 text-amber-700',
  Cancelado:   'bg-red-50 text-red-700',
};

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('metricas');

  // ── Métricas ────────────────────────────────────────────────────────────
  const [metricas, setMetricas] = useState<MetricasOut | null>(null);
  const [loadingMetricas, setLoadingMetricas] = useState(true);

  // ── Reservas ─────────────────────────────────────────────────────────────
  const [reservas, setReservas] = useState<ReservaOut[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [workerFilter, setWorkerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // ── Usuarios ─────────────────────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState<UsuarioOut[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // ── Carga inicial: métricas + top colaboradores ──────────────────────────
  useEffect(() => {
    api.admin.metricas()
      .then(setMetricas)
      .catch(console.error)
      .finally(() => setLoadingMetricas(false));
  }, []);

  // ── Carga por tab ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'reservas' && reservas.length === 0) {
      setLoadingReservas(true);
      api.admin.reservas()
        .then(setReservas)
        .catch(console.error)
        .finally(() => setLoadingReservas(false));
    }
    if (activeTab === 'usuarios' && usuarios.length === 0) {
      setLoadingUsuarios(true);
      api.admin.usuarios()
        .then(setUsuarios)
        .catch(console.error)
        .finally(() => setLoadingUsuarios(false));
    }
  }, [activeTab]);

  // ── Filtrado de reservas ─────────────────────────────────────────────────
  const reservasFiltradas = reservas.filter(r => {
    const matchWorker = workerFilter
      ? r.colaborador_nombre.toLowerCase().includes(workerFilter.toLowerCase())
      : true;
    const matchStatus = statusFilter ? r.estado === statusFilter : true;
    const matchDate   = dateFilter   ? r.fecha === dateFilter   : true;
    return matchWorker && matchStatus && matchDate;
  });

  // ── Inhabilitar / Habilitar usuario ─────────────────────────────────────
  const handleToggleEstado = async (usuario: UsuarioOut) => {
    setTogglingId(usuario.id);
    try {
      const updated = await api.admin.cambiarEstadoUsuario(usuario.id, !usuario.activo);
      setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const kpis = metricas
    ? [
        {
          label: 'Reservas (Mes)',
          value: metricas.total_reservas_mes.toLocaleString(),
          trend: `${metricas.reservas_completadas_mes} completadas`,
          icon: TrendingUp,
          color: 'text-teal-600',
          bg: 'bg-teal-50',
        },
        {
          label: 'Usuarios Activos',
          value: metricas.usuarios_activos.toLocaleString(),
          trend: 'En la plataforma',
          icon: Users,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
        },
        {
          label: 'Fondos Retenidos',
          value: `$${metricas.ingresos_retenidos.toLocaleString()}`,
          trend: 'En custodia',
          icon: Wallet,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
        },
      ]
    : [];

  const navItems: { id: AdminTab; label: string }[] = [
    { id: 'metricas', label: 'Métricas' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'usuarios', label: 'Usuarios' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 fixed h-full bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col">
        <div className="text-2xl font-black text-primary mb-12">ServiClean</div>
        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-editorial'
                  : 'text-slate-500 hover:bg-surface-low'
              }`}
            >
              {item.id === 'metricas' && <TrendingUp size={20} />}
              {item.id === 'reservas' && <Bell size={20} />}
              {item.id === 'usuarios' && <Users size={20} />}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
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

        {/* ── Tab: MÉTRICAS ─────────────────────────────────────────────── */}
        {activeTab === 'metricas' && (
          <>
            {loadingMetricas ? (
              <div className="flex items-center justify-center py-24 gap-4">
                <Loader2 size={36} className="text-primary animate-spin" />
                <p className="text-on-surface-variant">Cargando métricas...</p>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
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

                {/* Promedio global */}
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
                    <h3 className="text-xl font-bold mb-4">Calificación Global</h3>
                    <div className="flex items-center gap-3 mb-8">
                      <Star size={36} className="fill-amber-400 text-amber-400" />
                      <span className="text-5xl font-extrabold text-on-surface">
                        {metricas?.promedio_calificacion_global.toFixed(1) ?? '—'}
                      </span>
                      <span className="text-slate-400 text-lg font-medium">/ 5.0</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('reservas')}
                      className="w-full py-4 bg-surface-low text-slate-500 text-[1rem] font-bold uppercase tracking-widest rounded-2xl hover:bg-teal-50 hover:text-primary transition-all"
                    >
                      Ver Todas las Reservas
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Tab: RESERVAS ─────────────────────────────────────────────── */}
        {activeTab === 'reservas' && (
          <section className="card-editorial">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h3 className="text-2xl font-bold">Gestión de Reservas</h3>
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-48">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar colaborador..."
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
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {loadingReservas ? (
              <div className="flex items-center justify-center py-16 gap-4">
                <Loader2 size={32} className="text-primary animate-spin" />
                <p className="text-on-surface-variant">Cargando reservas...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                      <th className="pb-4 font-bold">ID</th>
                      <th className="pb-4 font-bold">Fecha y Hora</th>
                      <th className="pb-4 font-bold">Colaborador</th>
                      <th className="pb-4 font-bold">Cliente</th>
                      <th className="pb-4 font-bold">Monto</th>
                      <th className="pb-4 font-bold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {reservasFiltradas.map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-surface-low/50 transition-colors">
                        <td className="py-4 font-bold text-on-surface">RES-{String(r.id).padStart(3, '0')}</td>
                        <td className="py-4 text-on-surface-variant">{r.fecha} • {r.hora}</td>
                        <td className="py-4 font-medium">{r.colaborador_nombre}</td>
                        <td className="py-4 text-on-surface-variant">{r.cliente_nombre}</td>
                        <td className="py-4 font-bold">${r.precio.toFixed(2)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoBadge[r.estado] || 'bg-slate-50 text-slate-700'}`}>
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {reservasFiltradas.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No se encontraron reservas con los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Tab: USUARIOS ─────────────────────────────────────────────── */}
        {activeTab === 'usuarios' && (
          <section className="card-editorial">
            <h3 className="text-2xl font-bold mb-8">Gestión de Usuarios</h3>

            {loadingUsuarios ? (
              <div className="flex items-center justify-center py-16 gap-4">
                <Loader2 size={32} className="text-primary animate-spin" />
                <p className="text-on-surface-variant">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                      <th className="pb-4 font-bold">Usuario</th>
                      <th className="pb-4 font-bold">Email</th>
                      <th className="pb-4 font-bold">Rol</th>
                      <th className="pb-4 font-bold">Estado</th>
                      <th className="pb-4 font-bold">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {usuarios.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-surface-low/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.nombre} className="w-9 h-9" />
                            <span className="font-semibold text-on-surface">{u.nombre}</span>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant">{u.email}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.rol === 'admin'       ? 'bg-violet-50 text-violet-700' :
                            u.rol === 'colaborador' ? 'bg-blue-50 text-blue-700'    :
                                                      'bg-teal-50 text-teal-700'
                          }`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.activo ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-4">
                          {u.rol !== 'admin' && (
                            <button
                              onClick={() => handleToggleEstado(u)}
                              disabled={togglingId === u.id}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                u.activo
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                              } disabled:opacity-50`}
                            >
                              {togglingId === u.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : u.activo ? (
                                <><ShieldOff size={14} /> Inhabilitar</>
                              ) : (
                                <><ShieldCheck size={14} /> Habilitar</>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">No hay usuarios registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
