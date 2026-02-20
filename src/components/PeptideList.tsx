import React, { useState } from 'react';
import { Search, Clock, Syringe, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Peptide } from '../hooks/usePeptides';

interface PeptideListProps {
  peptides: Peptide[];
}

export default function PeptideList({ peptides }: PeptideListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'Todos'>('Todos');

  const categories = ['Todos', ...Array.from(new Set((peptides || []).map(p => p.category)))];

  const filteredPeptides = (peptides || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar por nome ou benefício..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-none focus:ring-0 text-slate-900 placeholder-slate-400 bg-transparent outline-none"
          />
        </div>
        
        <div className="h-px md:h-auto md:w-px bg-slate-200 mx-2"></div>
        
        <div className="flex gap-1 overflow-x-auto py-2 md:py-1 px-2 hide-scrollbar items-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPeptides.map(peptide => (
          <Link to={`/peptide/${peptide.id}`} key={peptide.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group">
            
            {/* Product Image */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img 
                src={peptide.image} 
                alt={peptide.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {peptide.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{peptide.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                  {peptide.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Activity size={14} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Dosagem</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">{peptide.standardDosage}</p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock size={14} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Meia-Vida</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">{peptide.halfLife}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-blue-600 font-medium">
                <span>Ver Ficha Completa</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
        
        {filteredPeptides.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum resultado encontrado</h3>
            <p className="text-slate-500">Tente ajustar seus termos de busca ou filtros de categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
