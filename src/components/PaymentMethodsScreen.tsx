import React, { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { PaymentMethod } from '../types';

interface Props {
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export const PaymentMethodsScreen: React.FC<Props> = ({ paymentMethods, setPaymentMethods }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', number: '' });

  const handleAdd = () => {
    if (newCard.name && newCard.number.length >= 4) {
      const last4 = newCard.number.slice(-4);
      const brand = newCard.number.startsWith('4') ? 'Visa' : 'Mastercard';
      setPaymentMethods([...paymentMethods, { id: Date.now().toString(), brand, last4, name: newCard.name }]);
      setNewCard({ name: '', number: '' });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
  };

  return (
    <div className="pb-32 pt-20 px-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4">Métodos de Pago</h1>
        <p className="text-lg text-on-surface-variant">Gestiona tus tarjetas para reservas rápidas y seguras.</p>
      </header>

      <div className="space-y-4 mb-8">
        {paymentMethods.map(method => (
          <div key={method.id} className="card-editorial p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{method.brand} terminada en {method.last4}</h3>
                <p className="text-on-surface-variant text-sm">{method.name}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(method.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {paymentMethods.length === 0 && !isAdding && (
          <p className="text-center text-slate-400 py-8">No tienes métodos de pago guardados.</p>
        )}
      </div>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={20} /> Agregar Nueva Tarjeta
        </button>
      ) : (
        <div className="card-editorial p-6 space-y-4 animate-in slide-in-from-bottom-4">
          <h3 className="font-bold text-lg mb-4">Nueva Tarjeta</h3>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Nombre en la tarjeta</label>
            <input type="text" className="input-minimal" value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 ml-2">Número de tarjeta</label>
            <input type="text" className="input-minimal font-mono" placeholder="0000 0000 0000 0000" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} />
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
