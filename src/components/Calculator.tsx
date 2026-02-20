import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Info, Droplet, Syringe, Activity, FlaskConical, AlertTriangle } from 'lucide-react';
import { Peptide } from '../hooks/usePeptides';

interface CalculatorProps {
  peptides: Peptide[];
}

export default function Calculator({ peptides }: CalculatorProps) {
  const [selectedPeptideId, setSelectedPeptideId] = useState<string>('');
  const [peptideMg, setPeptideMg] = useState<number | ''>(5);
  const [waterMl, setWaterMl] = useState<number | ''>(2);
  const [doseMcg, setDoseMcg] = useState<number | ''>(250);
  const [syringeSize, setSyringeSize] = useState<number>(1); // 1ml = 100 units

  // Auto-fill when a peptide is selected
  useEffect(() => {
    if (selectedPeptideId) {
      const peptide = peptides.find(p => p.id === selectedPeptideId);
      if (peptide) {
        // Try to extract standard dosage in mcg
        const dosageMatch = peptide.standardDosage.match(/(\d+)\s*mcg/i);
        if (dosageMatch && dosageMatch[1]) {
          setDoseMcg(Number(dosageMatch[1]));
        } else {
          // Try to extract in mg and convert
          const mgMatch = peptide.standardDosage.match(/(\d+(?:\.\d+)?)\s*mg/i);
          if (mgMatch && mgMatch[1]) {
            setDoseMcg(Number(mgMatch[1]) * 1000);
          }
        }
      }
    }
  }, [selectedPeptideId, peptides]);

  // Calculations
  const peptideMcg = typeof peptideMg === 'number' ? peptideMg * 1000 : 0;
  const concentrationMcgPerMl = typeof waterMl === 'number' && waterMl > 0 ? peptideMcg / waterMl : 0;
  const volumeNeededMl = typeof doseMcg === 'number' && concentrationMcgPerMl > 0 ? doseMcg / concentrationMcgPerMl : 0;
  
  // Syringe units (U-100 syringe: 1ml = 100 units)
  const unitsNeeded = volumeNeededMl * 100;
  const maxUnits = syringeSize * 100;
  const fillPercentage = Math.min(100, Math.max(0, (unitsNeeded / maxUnits) * 100));

  // Generate tick marks for the syringe
  const tickMarks = [];
  const tickCount = maxUnits === 100 ? 50 : maxUnits === 50 ? 50 : 30;
  for (let i = 0; i <= tickCount; i++) {
    const isMajor = maxUnits === 100 ? i % 5 === 0 : maxUnits === 50 ? i % 5 === 0 : i % 5 === 0;
    const unitValue = maxUnits === 100 ? i * 2 : i;
    tickMarks.push({ index: i, isMajor, unitValue });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Parâmetros da Solução</h2>
              <p className="text-sm text-slate-500 mb-6">Insira os dados do frasco e a dose desejada.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                  <FlaskConical size={14} className="text-blue-500" />
                  Preencher com Peptídeo (Opcional)
                </label>
                <select
                  value={selectedPeptideId}
                  onChange={(e) => setSelectedPeptideId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 outline-none appearance-none"
                >
                  <option value="">Selecione um peptídeo do catálogo...</option>
                  {(peptides || []).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.standardDosage})</option>
                  ))}
                </select>
              </div>

              <div className="h-px w-full bg-slate-100 my-2"></div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" />
                  Massa do Peptídeo (mg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={peptideMg}
                    onChange={(e) => setPeptideMg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium outline-none"
                    placeholder="Ex: 5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                  <Droplet size={14} className="text-blue-500" />
                  Água Bacteriostática (ml)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={waterMl}
                    onChange={(e) => setWaterMl(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium outline-none"
                    placeholder="Ex: 2"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">ml</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                  <Syringe size={14} className="text-blue-500" />
                  Dose Desejada (mcg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={doseMcg}
                    onChange={(e) => setDoseMcg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium outline-none"
                    placeholder="Ex: 250"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">mcg</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Tamanho da Seringa
                </label>
                <select
                  value={syringeSize}
                  onChange={(e) => setSyringeSize(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 font-medium outline-none appearance-none"
                >
                  <option value={0.3}>0.3ml (30 Unidades)</option>
                  <option value={0.5}>0.5ml (50 Unidades)</option>
                  <option value={1}>1.0ml (100 Unidades)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results & Visual Syringe Section */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-8 flex flex-col relative overflow-hidden text-white shadow-inner">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-8 relative z-10">
              <div>
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Resultado da Dosagem</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-light tracking-tighter text-white">
                    {unitsNeeded > 0 && isFinite(unitsNeeded) ? unitsNeeded.toFixed(1) : '0'}
                  </span>
                  <span className="text-xl font-medium text-slate-400">Unidades (UI)</span>
                </div>
                <p className="mt-3 text-sm text-slate-400 font-medium">
                  Volume equivalente: <strong className="text-white">{volumeNeededMl > 0 && isFinite(volumeNeededMl) ? volumeNeededMl.toFixed(3) : '0'} ml</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Concentração</div>
                  <div className="font-semibold text-lg text-white">
                    {concentrationMcgPerMl > 0 && isFinite(concentrationMcgPerMl) ? concentrationMcgPerMl.toFixed(0) : '0'} <span className="text-sm text-slate-400 font-normal">mcg/ml</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Por Unidade (1 UI)</div>
                  <div className="font-semibold text-lg text-white">
                    {concentrationMcgPerMl > 0 && isFinite(concentrationMcgPerMl) ? (concentrationMcgPerMl / 100).toFixed(1) : '0'} <span className="text-sm text-slate-400 font-normal">mcg</span>
                  </div>
                </div>
              </div>

              {unitsNeeded > maxUnits && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-500/20">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    Aviso: A dose calculada ({unitsNeeded.toFixed(1)} UI) excede a capacidade da seringa selecionada ({maxUnits} UI).
                  </p>
                </div>
              )}
            </div>

            {/* Syringe Visualization */}
            <div className="mt-auto pt-12 pb-2 relative z-10">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Visualização na Seringa U-100</h3>
              
              <div className="relative h-20 w-full max-w-md mx-auto flex items-center justify-center">
                
                {/* Syringe Hub & Needle (Left Side) */}
                <div className="w-4 h-8 bg-slate-700 border-y border-l border-slate-600 z-10 flex items-center justify-start relative">
                  <div className="w-2 h-5 bg-orange-500 rounded-l-sm absolute -left-2"></div>
                  {/* Needle */}
                  <div className="w-10 h-[1px] bg-slate-400 absolute -left-12"></div>
                </div>

                {/* Syringe Barrel */}
                <div className="relative w-64 h-14 border-2 border-slate-600 rounded-sm bg-white/10 backdrop-blur-md z-20 overflow-hidden flex shadow-inner">
                  {/* Liquid Fill (Starts from left) */}
                  <div 
                    className="h-full bg-blue-500/60 transition-all duration-600 ease-out"
                    style={{ width: `${fillPercentage}%`, transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  ></div>
                  
                  {/* Tick Marks Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between py-0.5 px-2">
                    <div className="w-full h-full flex justify-between items-start">
                      {tickMarks.map((tick, i) => (
                        <div key={i} className="relative flex flex-col items-center h-full">
                          <div className={`w-px bg-slate-400/80 ${tick.isMajor ? 'h-2.5' : 'h-1.5'}`}></div>
                          {tick.isMajor && (
                            <span className="absolute top-3 text-[8px] font-bold text-slate-300 -translate-x-1/2 left-1/2">
                              {tick.unitValue}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plunger Rod (Right Side) */}
                <div className="w-16 h-3 bg-slate-800 border-y border-slate-700 z-10 relative" style={{ transform: `translateX(-${fillPercentage}%)`, transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)', transformOrigin: 'left' }}>
                  {/* Plunger Rubber Tip (Inside barrel) */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-8 bg-slate-950 rounded-l-sm"></div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-slate-950"></div>
                </div>

                {/* Plunger Handle (Right Side) */}
                <div className="w-6 h-10 bg-slate-700 rounded-r-md border-y border-r border-slate-600 z-10 relative shadow-lg" style={{ transform: `translateX(-${fillPercentage}%)`, transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}></div>
                
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      <div className="bg-slate-100 rounded-xl p-5 flex gap-4 text-slate-600 text-sm">
        <Info className="shrink-0 mt-0.5 text-slate-400" size={20} />
        <div className="space-y-2 font-medium">
          <p><strong>Conversão Base:</strong> 1 mg (miligrama) = 1000 mcg (microgramas).</p>
          <p>As seringas de insulina U-100 são o padrão ouro para administração de peptídeos. Nelas, 1ml equivale a 100 unidades (UI).</p>
          <p>Sempre utilize práticas estéreis: limpe a tampa do frasco com álcool 70% antes de inserir a agulha e utilize seringas novas a cada aplicação.</p>
        </div>
      </div>
    </div>
  );
}
