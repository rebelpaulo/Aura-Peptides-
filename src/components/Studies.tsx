import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ExternalLink, Search, FlaskConical, GraduationCap, ShieldAlert, Database, FileText } from 'lucide-react';

export default function Studies() {
  const databases = [
    { name: 'PubMed', description: 'Biblioteca Nacional de Medicina dos EUA.', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
    { name: 'ScienceDirect', description: 'Publicações científicas e técnicas.', url: 'https://www.sciencedirect.com/' },
    { name: 'The Lancet', description: 'Uma das revistas médicas mais antigas e prestigiadas.', url: 'https://www.thelancet.com/' },
    { name: 'NEJM', description: 'New England Journal of Medicine.', url: 'https://www.nejm.org/' },
  ];

  const featuredStudies = [
    {
      title: "Triple-Hormone-Receptor Agonist Retatrutide for Obesity",
      journal: "New England Journal of Medicine",
      year: "2023",
      link: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
      tags: ["Retatrutide", "Obesity", "Phase 2"]
    },
    {
      title: "Tirzepatide once weekly for the treatment of obesity",
      journal: "The Lancet",
      year: "2022",
      link: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(22)01311-3/fulltext",
      tags: ["Tirzepatide", "Weight Loss", "GLP-1/GIP"]
    },
    {
      title: "BPC-157 as a therapy for muscle and tendon healing",
      journal: "Current Pharmaceutical Design",
      year: "2010",
      link: "https://pubmed.ncbi.nlm.nih.gov/21039313/",
      tags: ["BPC-157", "Healing", "Regeneration"]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12"
    >
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex gap-6 items-start">
        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 shrink-0">
          <ShieldAlert size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-amber-900">Aviso Legal de Pesquisa</h2>
          <p className="text-amber-800 leading-relaxed">
            As informações apresentadas nesta seção são baseadas em literatura científica revisada por pares e ensaios clínicos. 
            Os peptídeos mencionados são destinados exclusivamente para fins de pesquisa laboratorial e não para uso humano ou diagnóstico médico.
          </p>
        </div>
      </div>

      {/* Scientific Databases */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-slate-900">
          <Database className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold">Bases de Dados Científicas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {databases.map((db) => (
            <a 
              key={db.name}
              href={db.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 flex items-center justify-between">
                {db.name} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{db.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Studies */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-slate-900">
          <FileText className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold">Estudos em Destaque</h2>
        </div>
        <div className="space-y-4">
          {featuredStudies.map((study, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{study.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><BookOpen size={14} /> {study.journal}</span>
                    <span className="flex items-center gap-1.5"><GraduationCap size={14} /> {study.year}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <a 
                    href={study.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Ler Artigo <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Tips */}
      <div className="bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Como pesquisar?</h2>
            <p className="text-blue-100 leading-relaxed">
              Para encontrar estudos específicos, utilize termos técnicos nos bancos de dados. 
              Exemplo: "BPC-157 angiogenesis", "Retatrutide phase 3 trial results", "Semaglutide neuroprotection".
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Search size={20} />
              <span className="font-bold">Dica de Pesquisa</span>
            </div>
            <p className="text-sm text-blue-50">
              Adicione "filetype:pdf" à sua busca no Google para encontrar artigos científicos completos em formato PDF.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
