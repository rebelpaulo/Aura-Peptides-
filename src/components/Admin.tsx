import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, Sparkles, Loader2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Peptide } from '../hooks/usePeptides';

interface AdminProps {
  peptides: Peptide[];
  onUpdate: () => void;
}

export default function Admin({ peptides, onUpdate }: AdminProps) {
  const [isEditing, setIsEditing] = useState<string | 'new' | null>(null);
  const [formData, setFormData] = useState<Partial<Peptide>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleEdit = (peptide: Peptide) => {
    setFormData(peptide);
    setIsEditing(peptide.id);
  };

  const handleNew = () => {
    setFormData({
      id: '',
      name: '',
      category: 'Recuperação & Cicatrização',
      description: '',
      standardDosage: '',
      protocol: '',
      halfLife: '',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      supplierLink: 'https://researchpeptideseurope.com/',
      dosingReconstitutionGuide: '',
      suppliesNeeded: '',
      protocolOverview: '',
      dosingProtocol: '',
      storageInstructions: '',
      importantNotes: '',
      howThisWorks: '',
      lifestyleFactors: '',
      potentialBenefitsSideEffects: '',
      injectionTechnique: '',
      references: ''
    });
    setIsEditing('new');
  };

  const handleSave = async () => {
    try {
      const method = isEditing === 'new' ? 'POST' : 'PUT';
      const url = isEditing === 'new' ? '/api/peptides' : `/api/peptides/${isEditing}`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Falha ao salvar');
      
      setMessage({ type: 'success', text: 'Peptídeo salvo com sucesso!' });
      setIsEditing(null);
      onUpdate();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este peptídeo?')) return;
    
    try {
      const response = await fetch(`/api/peptides/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha ao excluir');
      
      setMessage({ type: 'success', text: 'Peptídeo excluído!' });
      onUpdate();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.name) {
      setMessage({ type: 'error', text: 'Insira o nome do peptídeo primeiro.' });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-peptide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name })
      });

      if (!response.ok) throw new Error('Falha na geração por IA');
      const data = await response.json();
      setFormData(prev => ({ ...prev, ...data }));
      setMessage({ type: 'success', text: 'Conteúdo gerado por IA!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Peptídeos</h1>
          <p className="text-slate-500">Adicione, edite ou remova peptídeos do catálogo.</p>
        </div>
        <button 
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Novo Peptídeo
        </button>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 border ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </motion.div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing === 'new' ? 'Adicionar Novo Peptídeo' : `Editando: ${formData.name}`}
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Informações Básicas</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Nome do Peptídeo</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.name || ''} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: BPC-157"
                    />
                    <button 
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="bg-slate-900 text-white px-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all"
                      title="Gerar com IA"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                      IA
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">ID (Slug)</label>
                    <input 
                      type="text" 
                      value={formData.id || ''} 
                      onChange={e => setFormData({...formData, id: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="ex: bpc-157"
                      disabled={isEditing !== 'new'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Categoria</label>
                    <select 
                      value={formData.category || ''} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Recuperação & Cicatrização</option>
                      <option>Perda de Peso & Metabólico</option>
                      <option>Longevidade & Anti-aging</option>
                      <option>Cognição & Humor</option>
                      <option>Imunidade</option>
                      <option>Saúde Sexual</option>
                      <option>Construção Muscular</option>
                      <option>Sono & Recuperação</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Descrição Curta</label>
                  <textarea 
                    value={formData.description || ''} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Dosagem Padrão</label>
                    <input 
                      type="text" 
                      value={formData.standardDosage || ''} 
                      onChange={e => setFormData({...formData, standardDosage: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Meia-Vida</label>
                    <input 
                      type="text" 
                      value={formData.halfLife || ''} 
                      onChange={e => setFormData({...formData, halfLife: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">URL da Imagem</label>
                  <input 
                    type="text" 
                    value={formData.image || ''} 
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Link do Fornecedor</label>
                  <input 
                    type="text" 
                    value={formData.supplierLink || ''} 
                    onChange={e => setFormData({...formData, supplierLink: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Conteúdo Detalhado (Markdown)</h3>
              
              <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {[
                  { id: 'dosingReconstitutionGuide', label: 'Guia de Reconstituição' },
                  { id: 'suppliesNeeded', label: 'Suprimentos Necessários' },
                  { id: 'protocolOverview', label: 'Visão Geral do Protocolo' },
                  { id: 'dosingProtocol', label: 'Protocolo de Dosagem' },
                  { id: 'storageInstructions', label: 'Instruções de Armazenamento' },
                  { id: 'importantNotes', label: 'Notas Importantes' },
                  { id: 'howThisWorks', label: 'Como Funciona' },
                  { id: 'lifestyleFactors', label: 'Fatores de Estilo de Vida' },
                  { id: 'potentialBenefitsSideEffects', label: 'Benefícios & Efeitos Colaterais' },
                  { id: 'injectionTechnique', label: 'Técnica de Injeção' },
                  { id: 'references', label: 'Referências' }
                ].map(field => (
                  <div key={field.id}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{field.label}</label>
                    <textarea 
                      value={(formData as any)[field.id] || ''} 
                      onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 text-sm font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button 
              onClick={() => setIsEditing(null)}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Save size={20} /> Salvar Peptídeo
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Peptídeo</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Dosagem</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {peptides.map(peptide => (
                  <tr key={peptide.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={peptide.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-bold text-slate-900">{peptide.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{peptide.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{peptide.standardDosage}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(peptide)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(peptide.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
