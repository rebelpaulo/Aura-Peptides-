import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlaskConical, Calculator as CalcIcon, BookOpen, Menu, X, Activity, Settings } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import PeptideList from './components/PeptideList';
import Calculator from './components/Calculator';
import Studies from './components/Studies';
import PeptideDetail from './components/PeptideDetail';
import Admin from './components/Admin';
import { usePeptides } from './hooks/usePeptides';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { peptides, loading, error, refetch } = usePeptides();
  const location = useLocation();

  const tabs = [
    { id: 'shop', label: 'Peptidos', icon: FlaskConical, path: '/' },
    { id: 'calculator', label: 'Calculadora', icon: CalcIcon, path: '/calculator' },
    { id: 'studies', label: 'Literatura Clínica', icon: BookOpen, path: '/studies' },
  ] as const;

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Dark Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400 border border-blue-500/30">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-white leading-none">Aura Peptides</span>
                <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">Research Excellence</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link 
                to="/admin"
                className={`p-2 transition-colors ${isAdmin ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                title="Backoffice"
              >
                <Settings size={24} />
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-400 hover:text-white p-2 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-800 overflow-hidden bg-slate-900/95 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = location.pathname === tab.path;
                  return (
                    <Link
                      key={tab.id}
                      to={tab.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white border border-blue-500/50' 
                          : 'text-slate-400 hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section (Contextual based on path) */}
      {!isAdmin && (
        <div className="bg-slate-900 text-white pb-24 pt-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-blue-600/10 blur-[120px]"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-sky-500/10 blur-[100px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl"
              >
                {location.pathname === '/' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
                      <FlaskConical size={14} />
                      Grau de Pesquisa
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                      Peptídeos de Alta Pureza
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                      Sintetizados para pesquisa laboratorial e estudos in vitro. Pureza garantida superior a 99% com certificação HPLC e MS.
                    </p>
                  </>
                )}
                {location.pathname === '/calculator' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
                      <CalcIcon size={14} />
                      Ferramenta de Precisão
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                      Calculadora de Reconstituição
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                      Determine com exatidão as concentrações e volumes de dosagem para pesquisa. Uma ferramenta essencial para precisão laboratorial.
                    </p>
                  </>
                )}
                {location.pathname === '/studies' && (
                  <>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
                      <BookOpen size={14} />
                      Evidência Científica
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                      Literatura & Estudos
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                      Acesso a publicações revisadas por pares, ensaios clínicos e bancos de dados médicos fundamentando a eficácia dos peptídeos.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-24 ${isAdmin ? 'pt-8' : '-mt-12'}`}>
        <Routes>
          <Route path="/" element={<PeptideList peptides={peptides} />} />
          <Route path="/calculator" element={<Calculator peptides={peptides} />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/peptide/:id" element={<PeptideDetail />} />
          <Route path="/admin" element={<Admin peptides={peptides} onUpdate={refetch} />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Activity size={20} />
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">Aura Peptides</span>
          </div>
          <div className="text-center md:text-right text-xs text-slate-500 max-w-md">
            <p>Este material destina-se exclusivamente a fins educacionais e de pesquisa.</p>
            <p className="mt-1">Os compostos mencionados não são avaliados pela FDA/ANVISA para consumo humano não supervisionado. Consulte sempre um profissional médico.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
