import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, ExternalLink, Clock, Syringe, Activity, FlaskConical, 
  AlertCircle, BookOpen, ShoppingCart, ClipboardList, Snowflake, 
  Lightbulb, Dumbbell, Scale, Info, ChevronRight, Atom
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Peptide } from '../hooks/usePeptides';

export default function PeptideDetail() {
  const { id } = useParams<{ id: string }>();
  const [peptide, setPeptide] = useState<Peptide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeptide = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/peptides/${id}`);
        if (!response.ok) throw new Error('Peptídeo não encontrado');
        const data = await response.json();
        setPeptide(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeptide();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !peptide) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Erro ao carregar</h2>
        <p className="text-slate-500 mb-6">{error || 'Peptídeo não encontrado'}</p>
        <Link to="/" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Voltar para a loja
        </Link>
      </div>
    );
  }

  const sections = [
    { id: 'quickstart', title: 'Destaques Rápidos', icon: Atom, content: peptide.description },
    { id: 'dosing-recon', title: 'Guia de Dosagem & Reconstituição', icon: BookOpen, content: peptide.dosingReconstitutionGuide },
    { id: 'supplies', title: 'Suprimentos Necessários', icon: ShoppingCart, content: peptide.suppliesNeeded },
    { id: 'overview', title: 'Visão Geral do Protocolo', icon: ClipboardList, content: peptide.protocolOverview },
    { id: 'protocol', title: 'Protocolo de Dosagem', icon: Syringe, content: peptide.dosingProtocol },
    { id: 'storage', title: 'Instruções de Armazenamento', icon: Snowflake, content: peptide.storageInstructions },
    { id: 'notes', title: 'Notas Importantes', icon: Lightbulb, content: peptide.importantNotes },
    { id: 'how-it-works', title: 'Como Funciona', icon: FlaskConical, content: peptide.howThisWorks },
    { id: 'lifestyle', title: 'Fatores de Estilo de Vida', icon: Dumbbell, content: peptide.lifestyleFactors },
    { id: 'benefits-side-effects', title: 'Benefícios & Efeitos Colaterais', icon: Scale, content: peptide.potentialBenefitsSideEffects },
    { id: 'technique', title: 'Técnica de Injeção', icon: Syringe, content: peptide.injectionTechnique },
    { id: 'references', title: 'Referências', icon: ChevronRight, content: peptide.references },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors mb-4">
            <ArrowLeft size={18} /> Voltar para a loja
          </Link>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <ClipboardList size={14} /> Conteúdo
            </h3>
            <nav className="space-y-1">
              {sections.map(section => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                >
                  <section.icon size={16} className="shrink-0" />
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 space-y-8"
      >
        <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors">
          <ArrowLeft size={18} /> Voltar para a loja
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-auto bg-slate-100">
              <img 
                src={peptide.image} 
                alt={peptide.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                  {peptide.category}
                </span>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{peptide.name}</h1>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                {peptide.description}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dosagem</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{peptide.standardDosage}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Meia-Vida</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{peptide.halfLife}</p>
                </div>
              </div>

              <div className="pt-8">
                <a 
                  href={peptide.supplierLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/20"
                >
                  Ver no Fornecedor <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.slice(1).map(section => (
            <section 
              key={section.id} 
              id={section.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12 scroll-mt-28"
            >
              <div className="flex items-center gap-3 text-blue-600 mb-6">
                <section.icon size={24} />
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-blue-400">
              <Info size={24} />
              <h2 className="text-2xl font-bold">Aviso Importante</h2>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Este conteúdo destina-se exclusivamente a fins educacionais e de pesquisa terapêutica e não constitui aconselhamento médico, diagnóstico ou tratamento. Peptídeos são compostos de investigação; consulte profissionais de saúde qualificados antes de considerar qualquer protocolo.
            </p>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="text-sm text-slate-400 italic">
                * Nota: Os protocolos mencionados são baseados em literatura científica e ensaios clínicos existentes. Aura Peptides fornece estas informações apenas para fins educacionais.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
