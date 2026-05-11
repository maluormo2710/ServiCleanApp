import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { Address } from '../types';

interface Props {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

export const AddressesScreen: React.FC<Props> = ({ addresses, setAddresses }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', fullAddress: '' });

  const handleAdd = () => {
    if (newAddress.name && newAddress.fullAddress) {
      setAddresses([...addresses, { ...newAddress, id: Date.now().toString() }]);
      setNewAddress({ name: '', fullAddress: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">Mis Direcciones</h1>
        <p className="text-lg text-on-surface-variant">Gestiona los lugares donde necesitas nuestros servicios.</p>
      </header>

      <div className="space-y-4 mb-8">
        {addresses.map(address => (
          <div key={address.id} className="card-editorial p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{address.name}</h3>
                <p className="text-on-surface-variant text-sm">{address.fullAddress}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(address.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {addresses.length === 0 && !isAdding && (
          <p className="text-center text-slate-400 py-8">No tienes direcciones guardadas.</p>
        )}
      </div>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={20} /> Agregar Nueva Dirección
        </button>
      ) : (
        <div className="card-editorial p-6 space-y-4 animate-in slide-in-from-bottom-4">
          <h3 className="font-bold text-lg mb-4">Nueva Dirección</h3>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Nombre (Ej. Casa, Oficina)</label>
            <input type="text" className="input-minimal" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Dirección Completa</label>
            <input type="text" className="input-minimal" value={newAddress.fullAddress} onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4">
            <button onClick={() => setIsAdding(false)} className="flex-1 py-4 rounded-full font-bold bg-surface-low text-on-surface">Cancelar</button>
            <button onClick={handleAdd} className="flex-1 py-4 rounded-full font-bold bg-primary text-white shadow-editorial">Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
};
