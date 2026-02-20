import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Peptide } from '../data/peptides';

export interface CartItem {
  peptide: Peptide;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + (item.peptide.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Carrinho</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <ShoppingBag size={48} className="text-slate-200" />
              <p>Seu carrinho está vazio.</p>
              <button 
                onClick={onClose}
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.peptide.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img 
                      src={item.peptide.image} 
                      alt={item.peptide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900 leading-tight">{item.peptide.name}</h3>
                        <button 
                          onClick={() => onRemove(item.peptide.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">€{item.peptide.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button 
                          onClick={() => onUpdateQuantity(item.peptide.id, -1)}
                          className="px-3 py-1 text-slate-600 hover:bg-slate-50 rounded-l-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-slate-900 border-x border-slate-200 min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.peptide.id, 1)}
                          className="px-3 py-1 text-slate-600 hover:bg-slate-50 rounded-r-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-slate-900">
                        €{(item.peptide.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-slate-900">€{total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-sm shadow-blue-600/20">
              Finalizar Compra
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Apenas para fins de pesquisa. Não para uso humano.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
