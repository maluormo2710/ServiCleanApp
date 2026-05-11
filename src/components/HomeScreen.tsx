import React, { useState, useEffect } from 'react';
import { Avatar } from './Avatar';
import { Star, Search, Loader2 } from 'lucide-react';
import { api, ColaboradorListItem } from '../services/api';

interface HomeScreenProps {
  onSelectWorker: (id: number) => void;
  onNavigateToMap?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectWorker, onNavigateToMap }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colaboradores, setColaboradores] = useState<ColaboradorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        setLoading(true);
        const data = await api.colaboradores.listar();
        setColaboradores(data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los colaboradores.');
      } finally {
        setLoading(false);
      }
    };
    fetchColaboradores();
  }, []);

  const filteredWorkers = colaboradores.filter(worker =>
    worker.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.especialidad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-32">
      <header className="pt-20 px-8 mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight">
          Encuentra la frescura <br />
          <span className="text-primary">que tu hogar merece.</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl mb-10 leading-relaxed">
          Reserva profesionales verificados para una limpieza profunda y garantizada en minutos.
        </p>

        <div className="bg-white p-2 rounded-[2.5rem] shadow-editorial flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-full bg-surface-low w-full">
            <Search size={20} className="text-primary" />
            <input
              type="text"
              placeholder="¿Qué necesitas limpiar?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none p-0 text-base font-semibold focus:ring-0 placeholder:text-slate-400 w-full"
            />
          </div>
          <button className="btn-primary w-full md:w-auto">
            Buscar
          </button>
        </div>
      </header>

      <section className="px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Limpiadores Disponibles</h2>
          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver mapa
            </button>
          )}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="text-primary animate-spin" />
            <p className="text-on-surface-variant font-medium">Cargando colaboradores...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && !loading && (
          <div className="text-center py-16 bg-red-50 rounded-3xl">
            <p className="text-red-600 font-semibold mb-2">No se pudo conectar con el servidor</p>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Lista de colaboradores */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => onSelectWorker(worker.id)}
                  className="bg-white rounded-[2rem] p-6 flex items-start gap-6 hover:shadow-ghost transition-all cursor-pointer group"
                >
                  <Avatar
                    src={worker.avatar_url}
                    name={worker.nombre}
                    className="w-24 h-24 rounded-2xl flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                        {worker.nombre}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span className="text-xs font-black text-amber-700">
                          {worker.calificacion_promedio.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant line-clamp-1">
                      {worker.especialidad}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-primary">${worker.tarifa_hora}</span>
                        <span className="text-xs font-medium text-slate-400">/hr</span>
                      </div>
                      <button className="text-primary text-xs font-bold px-4 py-2 rounded-full bg-surface-low hover:bg-primary/10 transition-colors">
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-on-surface-variant text-lg">
                  No se encontraron colaboradores que coincidan con tu búsqueda.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
