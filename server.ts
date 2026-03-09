// Aura Peptides Server v5 - Clean rebuild
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

console.log("Starting Aura Peptides Server v5...");

// Delete existing database to ensure fresh state
const dbPath = "peptides.db";
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS peptides (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    standardDosage TEXT NOT NULL,
    protocol TEXT NOT NULL,
    halfLife TEXT NOT NULL,
    image TEXT NOT NULL,
    supplierLink TEXT NOT NULL,
    dosingReconstitutionGuide TEXT NOT NULL,
    suppliesNeeded TEXT NOT NULL,
    protocolOverview TEXT NOT NULL,
    dosingProtocol TEXT NOT NULL,
    storageInstructions TEXT NOT NULL,
    importantNotes TEXT NOT NULL,
    howThisWorks TEXT NOT NULL,
    lifestyleFactors TEXT NOT NULL,
    potentialBenefitsSideEffects TEXT NOT NULL,
    injectionTechnique TEXT NOT NULL,
    references_content TEXT NOT NULL
  );
`);

// Peptide data array
const peptideData = [
  {
    id: "glow-70mg",
    name: "GLOW (70mg)",
    category: "Recuperacao & Cicatrizacao",
    description: "Blend de peptideos de pesquisa combinando GHK-Cu, TB-500 e BPC-157 em um unico frasco de 70 mg.",
    standardDosage: "2.33mg diario",
    protocol: "Injecao subcutanea uma vez ao dia por 4 semanas.",
    halfLife: "Variavel (Blend)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/glow-70mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 3.0 mL de agua bacteriostatica para uma concentracao de ~23.3 mg/mL.",
    suppliesNeeded: "- Frasco GLOW (70mg)\n- Seringas de Insulina\n- Agua Bacteriostatica\n- Lencos de Alcool",
    protocolOverview: "Objetivo: Apoiar a cicatrizacao abrangente de tecidos atraves de mecanismos sinergicos.",
    dosingProtocol: "Semanas 1-4: 2.330 mcg (2.33 mg) diario = 10 unidades (0.10 mL).",
    storageInstructions: "Liofilizado: congelar a -20C. Reconstituido: refrigerar a 2-8C e usar em ate 4 semanas.",
    importantNotes: "Para administracoes menores que 10 unidades, considere seringas de 30 ou 50 unidades para melhor precisao.",
    howThisWorks: "Combina as propriedades regenerativas do GHK-Cu, a mobilidade celular do TB-500 e a protecao tecidual do BPC-157.",
    lifestyleFactors: "Mantenha hidratacao adequada e suporte nutricional para sintese de colageno.",
    potentialBenefitsSideEffects: "Beneficios: Reparo tecidual acelerado, reducao de inflamacao. Efeitos: Irritacao local leve.",
    injectionTechnique: "Injecao subcutanea diaria.",
    references_content: "[1] Pickart L, et al. (2018) - GHK-Cu and regenerative medicine"
  },
  {
    id: "retatrutide-10mg",
    name: "Retatrutida (10mg)",
    category: "Perda de Peso & Metabolico",
    description: "Triplo agonista (GLP-1, GIP, Glucagon) para perda de peso extrema e saude metabolica.",
    standardDosage: "2mg - 12mg semanal",
    protocol: "Injecao subcutanea semanal com titulacao gradual.",
    halfLife: "6 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/retatrutide-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 5.0 mg/mL.",
    suppliesNeeded: "- Frasco Retatrutida (10mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Protocolo de 12-48 semanas focado em perda de peso de ate 24% do peso corporal.",
    dosingProtocol: "Semanas 1-4: 2mg\nSemanas 5-8: 4mg\nSemanas 9-12: 8mg\nSemana 13+: 12mg",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 2-4 semanas.",
    importantNotes: "A titulacao gradual e crucial para evitar efeitos gastrointestinais severos.",
    howThisWorks: "Ativa tres receptores hormonais para suprimir apetite e aumentar o gasto calorico.",
    lifestyleFactors: "Dieta rica em proteinas e exercicios de resistencia sao recomendados.",
    potentialBenefitsSideEffects: "Beneficios: Perda de peso massiva. Efeitos: Nauseas, vomitos, diarreia.",
    injectionTechnique: "Injecao subcutanea semanal.",
    references_content: "[1] Jastreboff AM, et al. (2023) - Triple-Hormone-Receptor Agonist Retatrutide"
  },
  {
    id: "semaglutide-5mg",
    name: "Semaglutida (5mg)",
    category: "Perda de Peso & Metabolico",
    description: "Agonista GLP-1 para controle de peso e diabetes tipo 2.",
    standardDosage: "0.25mg - 2.4mg semanal",
    protocol: "Injecao subcutanea semanal com titulacao gradual.",
    halfLife: "7 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/semaglutide-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco Semaglutida (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Protocolo de perda de peso progressivo de 16-20 semanas.",
    dosingProtocol: "Semanas 1-4: 0.25mg\nSemanas 5-8: 0.5mg\nSemanas 9-12: 1.0mg\nSemanas 13-16: 1.7mg\nSemana 17+: 2.4mg",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Nao aumentar a dose mais rapido que o recomendado.",
    howThisWorks: "Mimetiza o GLP-1 natural para reduzir apetite e melhorar controle glicemico.",
    lifestyleFactors: "Dieta hipocalorica e exercicio regular potencializam os resultados.",
    potentialBenefitsSideEffects: "Beneficios: Perda de peso de 15-20%. Efeitos: Nauseas iniciais, constipacao.",
    injectionTechnique: "Injecao subcutanea semanal no mesmo dia da semana.",
    references_content: "[1] Wilding JPH, et al. (2021) - STEP trials"
  },
  {
    id: "tirzepatide-10mg",
    name: "Tirzepatida (10mg)",
    category: "Perda de Peso & Metabolico",
    description: "Duplo agonista GLP-1/GIP para perda de peso e controle glicemico.",
    standardDosage: "2.5mg - 15mg semanal",
    protocol: "Injecao subcutanea semanal com titulacao gradual.",
    halfLife: "5 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tirzepatide-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 5.0 mg/mL.",
    suppliesNeeded: "- Frasco Tirzepatida (10mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Protocolo de 20+ semanas para perda de peso de ate 22%.",
    dosingProtocol: "Semanas 1-4: 2.5mg\nSemanas 5-8: 5mg\nSemanas 9-12: 7.5mg\nSemanas 13-16: 10mg\nSemana 17+: 12.5-15mg",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Monitorar para pancreatite em pacientes com historico.",
    howThisWorks: "Ativa receptores GLP-1 e GIP simultaneamente para efeito sinergico.",
    lifestyleFactors: "Alimentacao equilibrada e atividade fisica moderada.",
    potentialBenefitsSideEffects: "Beneficios: Perda de peso superior a semaglutida. Efeitos: Nauseas, diarreia.",
    injectionTechnique: "Injecao subcutanea semanal.",
    references_content: "[1] Jastreboff AM, et al. (2022) - SURMOUNT-1 trial"
  },
  {
    id: "bpc-157-5mg",
    name: "BPC-157 (5mg)",
    category: "Recuperacao & Cicatrizacao",
    description: "Peptideo gastrico com propriedades de cicatrizacao e recuperacao tecidual.",
    standardDosage: "250mcg - 500mcg diario",
    protocol: "Injecao subcutanea 1-2x ao dia por 4-8 semanas.",
    halfLife: "4 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/bpc-157-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco BPC-157 (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Protocolo de 4-8 semanas para recuperacao de lesoes.",
    dosingProtocol: "250-500mcg 1-2x ao dia, injecao proxima ao local da lesao se possivel.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Pode ser administrado oralmente para problemas gastrointestinais.",
    howThisWorks: "Estimula angiogenese e formacao de tecido de granulacao.",
    lifestyleFactors: "Repouso adequado e nutricao rica em proteinas.",
    potentialBenefitsSideEffects: "Beneficios: Cicatrizacao acelerada. Efeitos: Minimos relatados.",
    injectionTechnique: "Injecao subcutanea proxima ao local da lesao.",
    references_content: "[1] Sikiric P, et al. (2011) - BPC-157 healing properties"
  },
  {
    id: "tb-500-5mg",
    name: "TB-500 (5mg)",
    category: "Recuperacao & Cicatrizacao",
    description: "Timosina Beta-4 sintetica para recuperacao muscular e cicatrizacao.",
    standardDosage: "2mg - 5mg semanal",
    protocol: "Injecao subcutanea 2-3x por semana.",
    halfLife: "12-24 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tb-500-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco TB-500 (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Protocolo de carga de 4-6 semanas seguido de manutencao.",
    dosingProtocol: "Fase de carga: 2-2.5mg 2x/semana por 4-6 semanas\nManutencao: 2mg 1-2x/mes",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Funciona sistemicamente, nao precisa injetar no local da lesao.",
    howThisWorks: "Promove migracao celular e diferenciacao para reparo tecidual.",
    lifestyleFactors: "Fisioterapia e mobilidade gradual potencializam resultados.",
    potentialBenefitsSideEffects: "Beneficios: Recuperacao acelerada de lesoes. Efeitos: Fadiga temporaria.",
    injectionTechnique: "Injecao subcutanea em qualquer local.",
    references_content: "[1] Goldstein AL, et al. - Thymosin beta-4 research"
  },
  {
    id: "ghk-cu-50mg",
    name: "GHK-Cu (50mg)",
    category: "Longevidade & Anti-aging",
    description: "Peptideo de cobre com propriedades anti-envelhecimento e regenerativas.",
    standardDosage: "1mg - 2mg diario",
    protocol: "Injecao subcutanea ou aplicacao topica diaria.",
    halfLife: "2-4 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ghk-cu-50mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.5 mL de agua bacteriostatica para uma concentracao de 20 mg/mL.",
    suppliesNeeded: "- Frasco GHK-Cu (50mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Protocolo de 4-12 semanas para rejuvenescimento.",
    dosingProtocol: "1-2mg diario por injecao subcutanea ou aplicacao topica.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Evitar suplementos de zinco em excesso que competem com cobre.",
    howThisWorks: "Estimula sintese de colageno e tem propriedades antioxidantes.",
    lifestyleFactors: "Protecao solar e hidratacao adequada.",
    potentialBenefitsSideEffects: "Beneficios: Pele mais firme, cicatrizacao. Efeitos: Irritacao local.",
    injectionTechnique: "Injecao subcutanea ou aplicacao topica.",
    references_content: "[1] Pickart L, et al. - GHK peptide research"
  },
  {
    id: "epithalon-10mg",
    name: "Epithalon (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Peptideo que ativa telomerase para longevidade celular.",
    standardDosage: "5mg - 10mg diario",
    protocol: "Ciclos de 10-20 dias, 2-3x ao ano.",
    halfLife: "2-4 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/epithalon-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 5 mg/mL.",
    suppliesNeeded: "- Frasco Epithalon (10mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Ciclos de 10-20 dias, repetir 2-3x ao ano.",
    dosingProtocol: "5-10mg diario por 10-20 dias consecutivos.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Nao usar continuamente, respeitar os ciclos.",
    howThisWorks: "Ativa telomerase para alongar telomeros e retardar envelhecimento celular.",
    lifestyleFactors: "Sono adequado e reducao de estresse oxidativo.",
    potentialBenefitsSideEffects: "Beneficios: Longevidade celular. Efeitos: Raros.",
    injectionTechnique: "Injecao subcutanea ou intramuscular.",
    references_content: "[1] Khavinson VK, et al. - Epithalon and telomerase"
  },
  {
    id: "ipamorelin-5mg",
    name: "Ipamorelina (5mg)",
    category: "Hormonio de Crescimento",
    description: "Secretagogo de GH com liberacao seletiva e menos efeitos colaterais.",
    standardDosage: "200mcg - 300mcg 2-3x ao dia",
    protocol: "Injecao subcutanea antes do sono e em jejum.",
    halfLife: "2 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ipamorelin-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.5 mL de agua bacteriostatica para uma concentracao de 2 mg/mL.",
    suppliesNeeded: "- Frasco Ipamorelina (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso continuo ou em ciclos de 8-12 semanas.",
    dosingProtocol: "200-300mcg 2-3x ao dia, preferencialmente em jejum.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Administrar em jejum para maxima eficacia.",
    howThisWorks: "Estimula liberacao de GH pela hipofise sem afetar cortisol.",
    lifestyleFactors: "Treino de resistencia e sono adequado.",
    potentialBenefitsSideEffects: "Beneficios: Aumento de GH, recuperacao. Efeitos: Fome aumentada.",
    injectionTechnique: "Injecao subcutanea.",
    references_content: "[1] Raun K, et al. - Ipamorelin selectivity studies"
  },
  {
    id: "cjc-1295-dac-2mg",
    name: "CJC-1295 DAC (2mg)",
    category: "Hormonio de Crescimento",
    description: "GHRH modificado com meia-vida prolongada para liberacao sustentada de GH.",
    standardDosage: "2mg semanal",
    protocol: "Injecao subcutanea 1-2x por semana.",
    halfLife: "8 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/cjc-1295-dac-2mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 1 mg/mL.",
    suppliesNeeded: "- Frasco CJC-1295 DAC (2mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso continuo ou ciclos de 12-16 semanas.",
    dosingProtocol: "2mg 1-2x por semana.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "O DAC prolonga a meia-vida significativamente.",
    howThisWorks: "Estimula liberacao pulsatil de GH de forma sustentada.",
    lifestyleFactors: "Dieta e exercicio regulares.",
    potentialBenefitsSideEffects: "Beneficios: Aumento sustentado de GH. Efeitos: Retencao de agua.",
    injectionTechnique: "Injecao subcutanea.",
    references_content: "[1] Teichman SL, et al. - CJC-1295 pharmacokinetics"
  },
  {
    id: "mk-677-25mg",
    name: "MK-677 / Ibutamoren (25mg)",
    category: "Hormonio de Crescimento",
    description: "Secretagogo de GH oral com acao prolongada.",
    standardDosage: "10mg - 25mg diario",
    protocol: "Administracao oral diaria, preferencialmente a noite.",
    halfLife: "24 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/mk-677-25mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAdministracao oral. Nao requer reconstituicao.",
    suppliesNeeded: "- Frasco MK-677\n- Nenhum equipamento adicional necessario",
    protocolOverview: "Uso continuo ou ciclos de 8-12 semanas.",
    dosingProtocol: "10-25mg diario, preferencialmente a noite antes de dormir.",
    storageInstructions: "Armazenar em local fresco e seco.",
    importantNotes: "Pode aumentar apetite e causar retencao de liquidos.",
    howThisWorks: "Ativa receptor de grelina para estimular liberacao de GH.",
    lifestyleFactors: "Controlar ingestao calorica se ganho de peso for preocupacao.",
    potentialBenefitsSideEffects: "Beneficios: Aumento de GH e IGF-1. Efeitos: Fome, edema.",
    injectionTechnique: "Administracao oral.",
    references_content: "[1] Nass R, et al. - MK-677 and GH secretion"
  },
  {
    id: "pt-141-10mg",
    name: "PT-141 / Bremelanotida (10mg)",
    category: "Saude Sexual",
    description: "Agonista de melanocortina para disfuncao sexual.",
    standardDosage: "1mg - 2mg por uso",
    protocol: "Injecao subcutanea 45 minutos antes da atividade.",
    halfLife: "2.7 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/pt-141-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 5 mg/mL.",
    suppliesNeeded: "- Frasco PT-141 (10mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso conforme necessario, maximo 8 doses por mes.",
    dosingProtocol: "1-2mg 45 minutos antes da atividade desejada.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Nao usar mais de uma dose em 24 horas.",
    howThisWorks: "Ativa receptores de melanocortina no cerebro para aumentar desejo.",
    lifestyleFactors: "Evitar alcool em excesso.",
    potentialBenefitsSideEffects: "Beneficios: Aumento de libido. Efeitos: Nausea, rubor facial.",
    injectionTechnique: "Injecao subcutanea.",
    references_content: "[1] Diamond LE, et al. - Bremelanotide clinical trials"
  },
  {
    id: "selank-5mg",
    name: "Selank (5mg)",
    category: "Cognicao & Ansiedade",
    description: "Peptideo ansiolitico com propriedades nootrópicas.",
    standardDosage: "250mcg - 500mcg diario",
    protocol: "Administracao intranasal ou subcutanea diaria.",
    halfLife: "2-3 minutos (acao prolongada)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/selank-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco Selank (5mg)\n- Spray nasal ou seringas\n- Agua Bacteriostatica",
    protocolOverview: "Uso diario por 2-4 semanas.",
    dosingProtocol: "250-500mcg 1-2x ao dia, intranasal ou subcutaneo.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 2 semanas.",
    importantNotes: "Acao rapida, efeitos perceptiveis em minutos.",
    howThisWorks: "Modula GABA e serotonina para efeito ansiolitico.",
    lifestyleFactors: "Praticas de reducao de estresse complementam o uso.",
    potentialBenefitsSideEffects: "Beneficios: Reducao de ansiedade, clareza mental. Efeitos: Raros.",
    injectionTechnique: "Intranasal ou subcutaneo.",
    references_content: "[1] Seredenin SB, et al. - Selank anxiolytic effects"
  },
  {
    id: "semax-5mg",
    name: "Semax (5mg)",
    category: "Cognicao & Ansiedade",
    description: "Peptideo nootopico para funcao cognitiva e neuroproteção.",
    standardDosage: "200mcg - 600mcg diario",
    protocol: "Administracao intranasal diaria.",
    halfLife: "2-3 minutos (acao prolongada)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/semax-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco Semax (5mg)\n- Spray nasal\n- Agua Bacteriostatica",
    protocolOverview: "Uso diario por 2-4 semanas, com pausas.",
    dosingProtocol: "200-600mcg diario, dividido em 2-3 doses intranasais.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 2 semanas.",
    importantNotes: "Iniciar com dose baixa e aumentar gradualmente.",
    howThisWorks: "Aumenta BDNF e melhora plasticidade sinaptica.",
    lifestyleFactors: "Exercicio aerobico potencializa efeitos cognitivos.",
    potentialBenefitsSideEffects: "Beneficios: Memoria, foco, neuroproteção. Efeitos: Irritacao nasal.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Ashmarin IP, et al. - Semax cognitive enhancement"
  },
  {
    id: "thymosin-alpha-1-5mg",
    name: "Timosina Alfa-1 (5mg)",
    category: "Sistema Imunologico",
    description: "Peptideo imunomodulador para fortalecimento do sistema imune.",
    standardDosage: "1.6mg 2x por semana",
    protocol: "Injecao subcutanea 2x por semana.",
    halfLife: "2-3 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/thymosin-alpha-1-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 1.0 mL de agua bacteriostatica para uma concentracao de 5 mg/mL.",
    suppliesNeeded: "- Frasco Timosina Alfa-1 (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso continuo ou em periodos de necessidade imunologica.",
    dosingProtocol: "1.6mg 2x por semana.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Aprovado para uso clinico em varios paises.",
    howThisWorks: "Modula celulas T e melhora resposta imune adaptativa.",
    lifestyleFactors: "Sono adequado e nutricao balanceada.",
    potentialBenefitsSideEffects: "Beneficios: Imunidade fortalecida. Efeitos: Raros, irritacao local.",
    injectionTechnique: "Injecao subcutanea.",
    references_content: "[1] Garaci E, et al. - Thymosin alpha-1 immunomodulation"
  },
  {
    id: "ll-37-5mg",
    name: "LL-37 (5mg)",
    category: "Sistema Imunologico",
    description: "Peptideo antimicrobiano com propriedades imunomoduladoras.",
    standardDosage: "50mcg - 100mcg diario",
    protocol: "Injecao subcutanea diaria durante infeccoes.",
    halfLife: "4-6 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ll-37-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.5 mL de agua bacteriostatica para uma concentracao de 2 mg/mL.",
    suppliesNeeded: "- Frasco LL-37 (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso durante periodos de infeccao ou como profilaxia.",
    dosingProtocol: "50-100mcg diario durante infeccoes ativas.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 2 semanas.",
    importantNotes: "Possui atividade direta contra bacterias e virus.",
    howThisWorks: "Rompe membranas de patogenos e modula resposta inflamatoria.",
    lifestyleFactors: "Higiene adequada e nutricao para suporte imune.",
    potentialBenefitsSideEffects: "Beneficios: Acao antimicrobiana. Efeitos: Irritacao local.",
    injectionTechnique: "Injecao subcutanea.",
    references_content: "[1] Vandamme D, et al. - LL-37 antimicrobial properties"
  },
  {
    id: "aod-9604-5mg",
    name: "AOD-9604 (5mg)",
    category: "Perda de Peso & Metabolico",
    description: "Fragmento de GH para queima de gordura sem efeitos no acucar sanguineo.",
    standardDosage: "300mcg diario",
    protocol: "Injecao subcutanea diaria em jejum.",
    halfLife: "2-3 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/aod-9604-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.5 mL de agua bacteriostatica para uma concentracao de 2 mg/mL.",
    suppliesNeeded: "- Frasco AOD-9604 (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso diario por 12 semanas para perda de gordura.",
    dosingProtocol: "300mcg diario em jejum, preferencialmente pela manha.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Nao afeta niveis de glicose ou IGF-1.",
    howThisWorks: "Estimula lipolise sem os efeitos anabolicos do GH completo.",
    lifestyleFactors: "Exercicio cardiovascular e deficit calorico.",
    potentialBenefitsSideEffects: "Beneficios: Perda de gordura. Efeitos: Minimos relatados.",
    injectionTechnique: "Injecao subcutanea abdominal.",
    references_content: "[1] Heffernan M, et al. - AOD-9604 lipid metabolism"
  },
  {
    id: "hgh-fragment-176-191-5mg",
    name: "HGH Frag 176-191 (5mg)",
    category: "Perda de Peso & Metabolico",
    description: "Fragmento lipolítico do hormônio de crescimento.",
    standardDosage: "250mcg - 500mcg 2x ao dia",
    protocol: "Injecao subcutanea 2x ao dia em jejum.",
    halfLife: "30 minutos",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/hgh-fragment-176-191-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.5 mL de agua bacteriostatica para uma concentracao de 2 mg/mL.",
    suppliesNeeded: "- Frasco HGH Frag (5mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Uso diario por 8-12 semanas.",
    dosingProtocol: "250-500mcg 2x ao dia, em jejum.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Deve ser administrado em jejum para maxima eficacia.",
    howThisWorks: "Fragmento 176-191 do GH responsavel pela lipolise.",
    lifestyleFactors: "Jejum intermitente pode potencializar efeitos.",
    potentialBenefitsSideEffects: "Beneficios: Queima de gordura localizada. Efeitos: Hipoglicemia leve.",
    injectionTechnique: "Injecao subcutanea abdominal.",
    references_content: "[1] Wu Z, et al. - HGH fragment lipolytic activity"
  },
  {
    id: "dsip-5mg",
    name: "DSIP (5mg)",
    category: "Sono & Recuperacao",
    description: "Peptideo indutor de sono delta para qualidade do sono.",
    standardDosage: "100mcg - 200mcg antes de dormir",
    protocol: "Injecao subcutanea ou intranasal antes de dormir.",
    halfLife: "7-8 minutos",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/dsip-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.5 mL de agua bacteriostatica para uma concentracao de 2 mg/mL.",
    suppliesNeeded: "- Frasco DSIP (5mg)\n- Seringas de Insulina ou spray nasal\n- Agua Bacteriostatica",
    protocolOverview: "Uso conforme necessario ou ciclos de 2 semanas.",
    dosingProtocol: "100-200mcg 30 minutos antes de dormir.",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 2 semanas.",
    importantNotes: "Promove sono delta restaurador.",
    howThisWorks: "Modula ondas cerebrais para sono profundo.",
    lifestyleFactors: "Ambiente escuro e fresco para dormir.",
    potentialBenefitsSideEffects: "Beneficios: Sono profundo, recuperacao. Efeitos: Sonolencia prolongada.",
    injectionTechnique: "Subcutaneo ou intranasal.",
    references_content: "[1] Graf MV, et al. - DSIP and sleep induction"
  },
  {
    id: "melanotan-2-10mg",
    name: "Melanotan II (10mg)",
    category: "Bronzeamento & Estetica",
    description: "Agonista de melanocortina para bronzeamento e libido.",
    standardDosage: "250mcg - 500mcg",
    protocol: "Fase de carga seguida de manutencao.",
    halfLife: "33-36 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/melanotan-2-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituicao\nAdicione 2.0 mL de agua bacteriostatica para uma concentracao de 5 mg/mL.",
    suppliesNeeded: "- Frasco Melanotan II (10mg)\n- Seringas de Insulina\n- Agua Bacteriostatica",
    protocolOverview: "Fase de carga de 1-2 semanas, depois manutencao.",
    dosingProtocol: "Carga: 250-500mcg diario por 1-2 semanas\nManutencao: 250mcg 2x por semana",
    storageInstructions: "Liofilizado: -20C. Reconstituido: 2-8C por 4 semanas.",
    importantNotes: "Exposicao solar moderada necessaria para bronzeamento.",
    howThisWorks: "Estimula producao de melanina na pele.",
    lifestyleFactors: "Protecao solar ainda recomendada.",
    potentialBenefitsSideEffects: "Beneficios: Bronzeamento, libido. Efeitos: Nausea, rubor.",
    injectionTechnique: "Injecao subcutanea.",
    references_content: "[1] Dorr RT, et al. - Melanotan II clinical studies"
  }
];

// Insert all peptides
const count = db.prepare("SELECT COUNT(*) as count FROM peptides").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO peptides (
      id, name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
      dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
      importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references_content
    )
    VALUES (
      @id, @name, @category, @description, @standardDosage, @protocol, @halfLife, @image, @supplierLink,
      @dosingReconstitutionGuide, @suppliesNeeded, @protocolOverview, @dosingProtocol, @storageInstructions,
      @importantNotes, @howThisWorks, @lifestyleFactors, @potentialBenefitsSideEffects, @injectionTechnique, @references_content
    )
  `);
  
  for (const peptide of peptideData) {
    insert.run(peptide);
  }
}

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/peptides", (req, res) => {
    const peptides = db.prepare("SELECT * FROM peptides").all() as any[];
    const mapped = peptides.map(p => ({
      ...p,
      references: p.references_content
    }));
    res.json(mapped);
  });

  app.get("/api/peptides/:id", (req, res) => {
    const peptide = db.prepare("SELECT * FROM peptides WHERE id = ?").get(req.params.id) as any;
    if (peptide) {
      peptide.references = peptide.references_content;
      res.json(peptide);
    } else {
      res.status(404).json({ error: "Peptide not found" });
    }
  });

  app.post("/api/peptides", (req, res) => {
    const { 
      id, name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
      dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
      importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references
    } = req.body;
    try {
      db.prepare(`
        INSERT INTO peptides (
          id, name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
          dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
          importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references_content
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
        dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
        importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references
      );
      res.status(201).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to create peptide" });
    }
  });

  app.put("/api/peptides/:id", (req, res) => {
    const { 
      name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
      dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
      importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references
    } = req.body;
    try {
      db.prepare(`
        UPDATE peptides 
        SET name = ?, category = ?, description = ?, standardDosage = ?, 
            protocol = ?, halfLife = ?, image = ?, supplierLink = ?,
            dosingReconstitutionGuide = ?, suppliesNeeded = ?,
            protocolOverview = ?, dosingProtocol = ?, storageInstructions = ?,
            importantNotes = ?, howThisWorks = ?, lifestyleFactors = ?,
            potentialBenefitsSideEffects = ?, injectionTechnique = ?,
            references_content = ?
        WHERE id = ?
      `).run(
        name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
        dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
        importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references,
        req.params.id
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to update peptide" });
    }
  });

  app.delete("/api/peptides/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM peptides WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete peptide" });
    }
  });

  // AI Generation Route
  app.post("/api/generate-peptide", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Gere informacoes detalhadas sobre o peptideo "${name}" para um site educacional.
        O site e focado em pesquisa e educacao sobre peptideos.
        Retorne os dados estritamente no seguinte formato JSON:
        {
          "id": "nome-formatado-com-hifens",
          "name": "Nome do Peptideo",
          "category": "Categoria",
          "description": "Breve descricao de 1 a 2 frases.",
          "standardDosage": "Dosagem padrao",
          "protocol": "Protocolo de uso comum para pesquisa.",
          "halfLife": "Meia-vida estimada",
          "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
          "supplierLink": "https://researchpeptideseurope.com/",
          "dosingReconstitutionGuide": "Conteudo em Markdown sobre dosagem e reconstituicao.",
          "suppliesNeeded": "Conteudo em Markdown sobre suprimentos necessarios.",
          "protocolOverview": "Conteudo em Markdown com visao geral do protocolo.",
          "dosingProtocol": "Conteudo em Markdown detalhando o protocolo de dosagem.",
          "storageInstructions": "Conteudo em Markdown sobre instrucoes de armazenamento.",
          "importantNotes": "Conteudo em Markdown com notas importantes.",
          "howThisWorks": "Conteudo em Markdown explicando como funciona.",
          "lifestyleFactors": "Conteudo em Markdown sobre fatores de estilo de vida.",
          "potentialBenefitsSideEffects": "Conteudo em Markdown sobre beneficios e efeitos colaterais.",
          "injectionTechnique": "Conteudo em Markdown sobre tecnica de injecao.",
          "references": "Conteudo em Markdown com referencias cientificas."
        }
        IMPORTANTE: Todo o conteudo deve estar em PORTUGUES.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              standardDosage: { type: Type.STRING },
              protocol: { type: Type.STRING },
              halfLife: { type: Type.STRING },
              image: { type: Type.STRING },
              supplierLink: { type: Type.STRING },
              dosingReconstitutionGuide: { type: Type.STRING },
              suppliesNeeded: { type: Type.STRING },
              protocolOverview: { type: Type.STRING },
              dosingProtocol: { type: Type.STRING },
              storageInstructions: { type: Type.STRING },
              importantNotes: { type: Type.STRING },
              howThisWorks: { type: Type.STRING },
              lifestyleFactors: { type: Type.STRING },
              potentialBenefitsSideEffects: { type: Type.STRING },
              injectionTechnique: { type: Type.STRING },
              references: { type: Type.STRING }
            },
            required: [
              "id", "name", "category", "description", "standardDosage", "protocol", "halfLife", "image", "supplierLink",
              "dosingReconstitutionGuide", "suppliesNeeded", "protocolOverview", "dosingProtocol", "storageInstructions",
              "importantNotes", "howThisWorks", "lifestyleFactors", "potentialBenefitsSideEffects", "injectionTechnique", "references"
            ]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
