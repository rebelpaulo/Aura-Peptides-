// Aura Peptides Server - v2
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

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

// Insert some initial data if empty
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
  
  insert.run({
    id: "glow-70mg",
    name: "GLOW (70mg)",
    category: "Recuperação & Cicatrização",
    description: "Blend de peptídeos de pesquisa combinando GHK-Cu, TB-500 e BPC-157 em um único frasco de 70 mg.",
    standardDosage: "2.33mg diário",
    protocol: "Injeção subcutânea uma vez ao dia por 4 semanas.",
    halfLife: "Variável (Blend)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/glow-70mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~23.3 mg/mL.",
    suppliesNeeded: "- Frasco GLOW (70mg)\n- Seringas de Insulina (U-100, 0.3mL preferencialmente)\n- Água Bacteriostática\n- Lenços de Álcool",
    protocolOverview: "Objetivo: Apoiar a cicatrização abrangente de tecidos através de mecanismos sinérgicos: síntese de colágeno (GHK-Cu), migração celular (TB-500) e reparo localizado (BPC-157).",
    dosingProtocol: "Semanas 1-4: 2.330 mcg (2.33 mg) diário = 10 unidades (0.10 mL).",
    storageInstructions: "Liofilizado: congelar a -20°C. Reconstituído: refrigerar a 2-8°C e usar em até 4 semanas.",
    importantNotes: "Para administrações ≤10 unidades, considere seringas de 30 ou 50 unidades para melhor precisão.",
    howThisWorks: "Combina as propriedades regenerativas do GHK-Cu, a mobilidade celular do TB-500 e a proteção tecidual do BPC-157.",
    lifestyleFactors: "Mantenha hidratação adequada e suporte nutricional para síntese de colágeno.",
    potentialBenefitsSideEffects: "Benefícios: Reparo tecidual acelerado, redução de inflamação. Efeitos: Irritação local leve.",
    injectionTechnique: "Injeção subcutânea diária.",
    references_content: "[1] Pickart L, et al. (2018) - GHK-Cu and regenerative medicine\n[2] Sikiric P, et al. (2011) - BPC-157 and tissue healing"
  });

  insert.run({
    id: "retatrutide-10mg",
    name: "Retatrutida (10mg)",
    category: "Perda de Peso & Metabólico",
    description: "Triplo agonista (GLP-1, GIP, Glucagon) para perda de peso extrema e saúde metabólica.",
    standardDosage: "2mg - 12mg semanal",
    protocol: "Injeção subcutânea semanal com titulação gradual.",
    halfLife: "6 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/retatrutide-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5.0 mg/mL.",
    suppliesNeeded: "- Frasco Retatrutida (10mg)\n- Seringas de Insulina (U-100)\n- Água Bacteriostática\n- Lenços de Álcool",
    protocolOverview: "Protocolo de 12-48 semanas focado em perda de peso de até 24% do peso corporal.",
    dosingProtocol: "Semanas 1-4: 2mg (40 UI)\nSemanas 5-8: 4mg (80 UI)\nSemanas 9-12: 8mg (160 UI - dividir dose)\nSemana 13+: 12mg (240 UI - dividir dose)",
    storageInstructions: "Liofilizado: -20°C. Reconstituído: 2-8°C por 2-4 semanas.",
    importantNotes: "A titulação gradual é crucial para evitar efeitos gastrointestinais severos.",
    howThisWorks: "Ativa três receptores hormonais para suprimir apetite e aumentar o gasto calórico via glucagon.",
    lifestyleFactors: "Dieta rica em proteínas e exercícios de resistência são recomendados.",
    potentialBenefitsSideEffects: "Benefícios: Perda de peso massiva. Efeitos: Náuseas, vômitos, diarreia.",
    injectionTechnique: "Subcutânea semanal.",
    references_content: "[1] NEJM (2023) - Retatrutide for Obesity\n[2] Lancet (2023) - Retatrutide in Type 2 Diabetes"
  });

  insert.run({
    id: "ipamorelin-10mg",
    name: "Ipamorelina (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Secretagogo de GH altamente seletivo que não afeta cortisol ou prolactina.",
    standardDosage: "100mcg - 300mcg diário",
    protocol: "Injeção subcutânea diária, preferencialmente antes de dormir.",
    halfLife: "2 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ipamorelin-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~3.33 mg/mL.",
    suppliesNeeded: "- Frasco Ipamorelina (10mg)\n- Seringas de Insulina (U-100)\n- Água Bacteriostática",
    protocolOverview: "Estimula a liberação pulsátil de hormônio do crescimento de forma natural.",
    dosingProtocol: "Semanas 1-2: 100mcg (3 UI)\nSemanas 3-4: 150mcg (5 UI)\nSemanas 5-8: 200mcg (6 UI)\nSemanas 9-12: 250mcg (8 UI)",
    storageInstructions: "Refrigerar a 2-8°C. Usar em até 4 semanas.",
    importantNotes: "Injetar com estômago vazio para máxima eficácia.",
    howThisWorks: "Imita a grelina no receptor GHSR-1a para sinalizar a liberação de GH.",
    lifestyleFactors: "Sono profundo potencializa a liberação de GH.",
    potentialBenefitsSideEffects: "Benefícios: Melhora da composição corporal, sono e pele. Efeitos: Raros.",
    injectionTechnique: "Subcutânea diária.",
    references_content: "[1] PubMed - Ipamorelin selectivity studies"
  });

  insert.run({
    id: "selank-10mg",
    name: "Selank (10mg)",
    category: "Cognição & Humor",
    description: "Heptapeptídeo análogo da tuftsina com propriedades ansiolíticas e nootrópicas.",
    standardDosage: "300mcg - 500mcg diário",
    protocol: "Injeção subcutânea diária ou uso intranasal.",
    halfLife: "2-4 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/selank-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~3.33 mg/mL.",
    suppliesNeeded: "- Frasco Selank (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Reduz a ansiedade sem causar sedação ou dependência.",
    dosingProtocol: "Semanas 1-2: 300mcg (9 UI)\nSemanas 3-4: 500mcg (15 UI)",
    storageInstructions: "Refrigerar. Evitar ciclos de congelamento.",
    importantNotes: "Ciclos comuns de 4 semanas com 4 semanas de intervalo.",
    howThisWorks: "Modula a expressão gênica do GABA e preserva encefalinas endógenas.",
    lifestyleFactors: "Práticas de meditação e higiene do sono complementam o efeito.",
    potentialBenefitsSideEffects: "Benefícios: Calma focada, melhora da memória. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] PubMed - Selank clinical trials in GAD"
  });

  insert.run({
    id: "5-amino-1mq",
    name: "5-Amino-1MQ",
    category: "Perda de Peso & Metabólico",
    description: "Inibidor seletivo da enzima NNMT que aumenta os níveis de NAD+ e o gasto energético celular.",
    standardDosage: "50mg - 150mg diário",
    protocol: "Uso oral (geralmente cápsulas) ou injeção em protocolos de pesquisa.",
    halfLife: "Variável",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/5-amino-1mq-50mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nSe em pó para pesquisa: Reconstituir em água bacteriostática ou solução salina estéril.",
    suppliesNeeded: "- Cápsulas ou Frasco de 5-Amino-1MQ\n- Água Bacteriostática (se injetável)",
    protocolOverview: "Atua como um 'acelerador metabólico' sem suprimir o apetite, focando na queima de gordura intracelular.",
    dosingProtocol: "Comum: 50mg três vezes ao dia com as refeições.",
    storageInstructions: "Manter em local fresco e seco. Se reconstituído, refrigerar a 2-8°C.",
    importantNotes: "Não é um peptídeo, mas uma pequena molécula inibidora enzimática.",
    howThisWorks: "Bloqueia a NNMT, impedindo o desperdício de nicotinamida e restaurando os níveis de NAD+.",
    lifestyleFactors: "Funciona sinergicamente com exercícios físicos.",
    potentialBenefitsSideEffects: "Benefícios: Perda de gordura, aumento de energia, melhora metabólica. Efeitos: Mínimos.",
    injectionTechnique: "Oral ou Subcutânea (dependendo da forma).",
    references_content: "[1] Neelakantan H, et al. (2018) - NNMT inhibitors for obesity"
  });

  insert.run({
    id: "ghk-cu-50mg",
    name: "GHK-Cu (50mg)",
    category: "Recuperação & Cicatrização",
    description: "Complexo de cobre do tripeptídeo GHK, conhecido por suas propriedades regenerativas da pele e tecidos.",
    standardDosage: "1mg - 2mg diário",
    protocol: "Injeção subcutânea ou aplicação tópica.",
    halfLife: "Curta (minutos a horas)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ghk-cu-50mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 25 mg/mL.",
    suppliesNeeded: "- Frasco GHK-Cu (50mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Sinalizador de reparo tecidual que modula a inflamação e estimula a síntese de colágeno.",
    dosingProtocol: "Comum: 2mg (8 UI) por dia via subcutânea.",
    storageInstructions: "Refrigerar após reconstituição. Proteger da luz.",
    importantNotes: "Pode causar ardência no local da injeção; diluição maior pode ajudar.",
    howThisWorks: "Atua como transportador de cobre e modulador de genes de reparo e turnover da matriz extracelular.",
    lifestyleFactors: "Suplementação com zinco pode ser necessária se usado por longos períodos.",
    potentialBenefitsSideEffects: "Benefícios: Rejuvenescimento da pele, cura de feridas, saúde capilar. Efeitos: Dor local.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Pickart L. (2008) - The human tri-peptide GHK and tissue remodeling"
  });

  insert.run({
    id: "tesamorelin-2mg",
    name: "Tesamorelina (2mg)",
    category: "Perda de Peso & Metabólico",
    description: "Análogo do GHRH estabilizado para redução de gordura visceral abdominal.",
    standardDosage: "2mg diário",
    protocol: "Injeção subcutânea diária.",
    halfLife: "8-38 minutos",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tesamorelin-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 0.5 mL de água estéril para injeção para uma concentração de 4 mg/mL.",
    suppliesNeeded: "- Frasco Tesamorelina (2mg)\n- Seringas de Insulina\n- Água Estéril",
    protocolOverview: "Reduz o tecido adiposo visceral (VAT) em ~15-20% sem afetar a gordura subcutânea.",
    dosingProtocol: "Dose padrão: 2mg (ou 1.4mg dependendo da formulação) uma vez ao dia.",
    storageInstructions: "IMPORTANTE: Manter em temperatura ambiente (20-25°C) após reconstituição se usar água bacteriostática. NÃO congelar.",
    importantNotes: "Pode 'gelificar' se refrigerado; siga rigorosamente as instruções de temperatura.",
    howThisWorks: "Estimula a liberação pulsátil de GH, favorecendo a lipólise visceral.",
    lifestyleFactors: "Monitorar níveis de glicose no sangue.",
    potentialBenefitsSideEffects: "Benefícios: Redução significativa da circunferência abdominal. Efeitos: Edema, dor articular.",
    injectionTechnique: "Subcutânea diária.",
    references_content: "[1] FDA - Egrifta (Tesamorelin) prescribing information"
  });

  insert.run({
    id: "bpc-157-5mg",
    name: "BPC-157 (5mg)",
    category: "Recuperação & Cicatrização",
    description: "Peptídeo regenerativo potente derivado de uma proteína gástrica, estudado para cura de tecidos e proteção intestinal.",
    standardDosage: "250mcg - 500mcg diário",
    protocol: "Injeção subcutânea ou intramuscular diária.",
    halfLife: "4-6 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/bpc-157-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL (2500 mcg/mL).",
    suppliesNeeded: "- Frasco BPC-157 (5mg)\n- Seringas de Insulina (U-100)\n- Água Bacteriostática",
    protocolOverview: "Acelera a reparação de músculos, tendões, ossos e úlceras gástricas através da angiogênese e modulação de óxido nítrico.",
    dosingProtocol: "Dose comum: 250mcg (10 UI) a 500mcg (20 UI) uma ou duas vezes ao dia.",
    storageInstructions: "Liofilizado: refrigerar a 2-8°C. Reconstituído: refrigerar e usar em até 4-6 semanas.",
    importantNotes: "Altamente estável e seguro em modelos animais; não aprovado para uso humano.",
    howThisWorks: "Aumenta a expressão de receptores de hormônio de crescimento e promove a formação de novos vasos sanguíneos.",
    lifestyleFactors: "Combine com fisioterapia para otimizar a recuperação de lesões.",
    potentialBenefitsSideEffects: "Benefícios: Cicatrização acelerada, redução de inflamação sistêmica. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea ou Intramuscular (perto do local da lenção se possível).",
    references_content: "[1] Sikiric P, et al. (2011) - BPC-157 and tissue healing\n[2] Chang CH, et al. (2011) - BPC-157 promotes tendon healing"
  });

  insert.run({
    id: "tb-500-5mg",
    name: "TB-500 (5mg)",
    category: "Recuperação & Cicatrização",
    description: "Versão sintética da Timosina Beta-4, promove a migração celular e a cura sistêmica de tecidos.",
    standardDosage: "2mg - 5mg semanal",
    protocol: "Injeção subcutânea ou intramuscular 1 a 2 vezes por semana.",
    halfLife: "7-15 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tb-500-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco TB-500 (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Focado na reparação de tecidos moles (músculos, tendões, ligamentos) e redução de fibrose.",
    dosingProtocol: "Fase de carga: 5mg/semana por 4 semanas. Manutenção: 2mg/semana por 4-8 semanas.",
    storageInstructions: "Refrigerar após reconstituição. Evitar luz direta.",
    importantNotes: "Frequentemente combinado com BPC-157 para efeitos sinérgicos de cura.",
    howThisWorks: "Regula a actina, uma proteína vital para a estrutura e movimento celular, facilitando a migração para áreas lesionadas.",
    lifestyleFactors: "Evitar esforço excessivo na área lesionada durante a fase inicial de cura.",
    potentialBenefitsSideEffects: "Benefícios: Melhora na amplitude de movimento, cura rápida de feridas. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea ou Intramuscular.",
    references_content: "[1] Philp D, et al. (2003) - Thymosin beta4 and tissue repair"
  });

  insert.run({
    id: "thymosin-alpha-1-10mg",
    name: "Thymosin Alpha-1 (10mg)",
    category: "Imunidade",
    description: "Peptídeo imunomodulador potente que aumenta a função das células T e a resposta imunológica contra infecções.",
    standardDosage: "1.5mg - 3mg por dose",
    protocol: "Injeção subcutânea 2 a 3 vezes por semana.",
    halfLife: "2 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/thymosin-alpha-1-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco Thymosin Alpha-1 (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Suporta o sistema imunológico através da ativação de células natural killer (NK) e modulação de citocinas.",
    dosingProtocol: "Comum: 1.6mg (32 UI) duas vezes por semana por 4-8 semanas.",
    storageInstructions: "Refrigerar a 2-8°C. Proteger da luz.",
    importantNotes: "Utilizado clinicamente em alguns países para hepatite B e C e como adjuvante em vacinas.",
    howThisWorks: "Atua no timo para promover a maturação de linfócitos T e restaurar a homeostase imunológica.",
    lifestyleFactors: "Manter níveis adequados de Vitamina D e sono para suporte imunológico.",
    potentialBenefitsSideEffects: "Benefícios: Resiliência imunológica aumentada. Efeitos: Vermelhidão local.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Ancell CD, et al. (2001) - Thymosin alpha-1\n[2] Matteucci C, et al. (2017) - Thymosin alpha 1 and immunity"
  });

  insert.run({
    id: "semax-10mg",
    name: "Semax (10mg)",
    category: "Cognição & Humor",
    description: "Heptapeptídeo nootrópico com propriedades neuroprotetoras e de melhoria cognitiva.",
    standardDosage: "200mcg - 600mcg diário",
    protocol: "Uso intranasal ou injeção subcutânea.",
    halfLife: "Curta (minutos), mas efeitos duradouros",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/semax-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco Semax (10mg)\n- Seringas de Insulina ou Spray Nasal\n- Água Bacteriostática",
    protocolOverview: "Aumenta os níveis de BDNF e modula os sistemas de neurotransmissores para foco e memória.",
    dosingProtocol: "Comum: 300mcg (6 UI) por dia pela manhã.",
    storageInstructions: "Refrigerar a 2-8°C. Evitar luz solar.",
    importantNotes: "Desenvolvido na Rússia para tratamento de AVC e distúrbios cognitivos.",
    howThisWorks: "Estimula a expressão de fatores neurotróficos e protege neurônios contra estresse oxidativo.",
    lifestyleFactors: "Exercício mental e boa hidratação potencializam os efeitos nootrópicos.",
    potentialBenefitsSideEffects: "Benefícios: Foco aguçado, melhora da memória, neuroproteção. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea ou Intranasal.",
    references_content: "[1] Agapov MM, et al. (2014) - Semax in clinical practice\n[2] Gusev EI, et al. (2005) - Neuroprotective effects of Semax"
  });

  insert.run({
    id: "kpv-10mg",
    name: "KPV (10mg)",
    category: "Recuperação & Cicatrização",
    description: "Tripeptídeo anti-inflamatório potente que atua nas barreiras teciduais (intestino, pele, olhos).",
    standardDosage: "200mcg - 500mcg diário",
    protocol: "Uso oral, tópico ou injeção subcutânea.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/kpv-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco KPV (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Reduz a inflamação mediada por NF-κB sem os efeitos de pigmentação do alfa-MSH.",
    dosingProtocol: "Comum: 250mcg (5 UI) uma vez ao dia.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Eficaz para colite ulcerosa e condições inflamatórias da pele.",
    howThisWorks: "Transportado pelo transportador PepT1 para dentro das células para modular citocinas pró-inflamatórias.",
    lifestyleFactors: "Dieta anti-inflamatória apoia a eficácia do KPV.",
    potentialBenefitsSideEffects: "Benefícios: Redução de inflamação intestinal e cutânea. Efeitos: Raros.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Dalmasso G, et al. (2008) - KPV and intestinal inflammation\n[2] Brzoska T, et al. (2008) - Anti-inflammatory effects of alpha-MSH"
  });

  insert.run({
    id: "pt-141-10mg",
    name: "PT-141 (Bremelanotida) (10mg)",
    category: "Saúde Sexual",
    description: "Agonista do receptor de melanocortina estudado para o tratamento de disfunção sexual.",
    standardDosage: "1mg - 2mg por dose",
    protocol: "Injeção subcutânea conforme necessário (PRN).",
    halfLife: "2-3 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/pt-141-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco PT-141 (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Atua no sistema nervoso central para aumentar o desejo sexual e a excitação.",
    dosingProtocol: "Comum: 1.5mg (30 UI) injetados 45 minutos a 2 horas antes da atividade.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode causar náuseas temporárias e aumento da pressão arterial.",
    howThisWorks: "Liga-se aos receptores MC3R e MC4R no hipotálamo.",
    lifestyleFactors: "Evitar álcool em excesso para melhor resposta.",
    potentialBenefitsSideEffects: "Benefícios: Melhora da libido e função erétil. Efeitos: Náuseas, rubor facial.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Kingsberg SA, et al. (2019) - Bremelanotide for hypoactive sexual desire disorder\n[2] Safarinejad MR, et al. (2008) - PT-141 in erectile dysfunction"
  });

  insert.run({
    id: "epithalon-10mg",
    name: "Epithalon (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Tetrapeptídeo sintético estudado por sua capacidade de ativar a telomerase e estender os telômeros.",
    standardDosage: "5mg - 10mg diário (ciclos curtos)",
    protocol: "Injeção subcutânea diária por 10-20 dias, repetido a cada 6 meses.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/epithalon-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco Epithalon (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Focado na extensão da vida útil celular e regulação da glândula pineal.",
    dosingProtocol: "Comum: 5mg (100 UI se 1mL) por dia durante 10 dias.",
    storageInstructions: "Refrigerar a 2-8°C. Proteger da luz.",
    importantNotes: "Frequentemente usado em protocolos de rejuvenescimento sistêmico.",
    howThisWorks: "Induz a atividade da telomerase e normaliza a produção de melatonina.",
    lifestyleFactors: "Sono regular e dieta rica em nutrientes apoiam os efeitos geroprotetores.",
    potentialBenefitsSideEffects: "Benefícios: Longevidade celular, melhora do sono. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Khavinson V, et al. (2003) - Epithalon and telomerase activity\n[2] Anisimov VN, et al. (2001) - Epithalon and lifespan extension"
  });

  insert.run({
    id: "mots-c-10mg",
    name: "MOTS-C (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo derivado da mitocôndria que regula o metabolismo e promove a flexibilidade metabólica.",
    standardDosage: "5mg - 10mg por semana",
    protocol: "Injeção subcutânea 1 a 3 vezes por semana.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/mots-c-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco MOTS-C (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Imita os efeitos do exercício no metabolismo, melhorando a sensibilidade à insulina e o gasto de energia.",
    dosingProtocol: "Comum: 5mg (100 UI) duas vezes por semana por 4-6 semanas.",
    storageInstructions: "Refrigerar a 2-8°C. Sensível ao calor.",
    importantNotes: "Pode melhorar significativamente o desempenho físico e a resistência.",
    howThisWorks: "Ativa a via AMPK e regula a expressão de genes nucleares envolvidos no metabolismo da glicose.",
    lifestyleFactors: "Otimizado quando combinado com treinamento de resistência.",
    potentialBenefitsSideEffects: "Benefícios: Perda de gordura, aumento de energia, longevidade. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Lee C, et al. (2015) - MOTS-c and metabolic homeostasis\n[2] Kim KH, et al. (2018) - MOTS-c prevents obesity"
  });

  insert.run({
    id: "nad-plus-1000mg",
    name: "NAD+ (1000mg)",
    category: "Longevidade & Anti-aging",
    description: "Coenzima essencial encontrada em todas as células vivas, crucial para a produção de energia e reparo do DNA.",
    standardDosage: "50mg - 200mg por dose",
    protocol: "Injeção subcutânea ou intramuscular diária ou em dias alternados.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/1000mg-nad-plus/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 5.0 mL de água bacteriostática para uma concentração de 200 mg/mL.",
    suppliesNeeded: "- Frasco NAD+ (1000mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Restaura os níveis celulares de NAD+ que declinam com a idade, apoiando a função mitocondrial.",
    dosingProtocol: "Comum: 100mg (50 UI se 200mg/mL) por dia.",
    storageInstructions: "Refrigerar a 2-8°C. Extremamente sensível à luz e calor.",
    importantNotes: "Pode causar sensação de aperto no peito ou náuseas se injetado muito rapidamente (IM).",
    howThisWorks: "Atua como substrato para sirtuínas e enzimas de reparo do DNA (PARPs).",
    lifestyleFactors: "Jejum intermitente e exercícios também aumentam o NAD+ endógeno.",
    potentialBenefitsSideEffects: "Benefícios: Clareza mental, energia, reparo celular. Efeitos: Fadiga temporária, náuseas.",
    injectionTechnique: "Subcutânea ou Intramuscular.",
    references_content: "[1] Imai S, et al. (2014) - NAD+ and aging\n[2] Rajman L, et al. (2018) - Therapeutic potential of NAD-boosting molecules"
  });

  insert.run({
    id: "cjc-1295-no-dac-5mg",
    name: "CJC-1295 (Sem DAC) (5mg)",
    category: "Longevidade & Anti-aging",
    description: "Análogo do GHRH que estimula a glândula pituitária a liberar hormônio do crescimento de forma pulsátil.",
    standardDosage: "100mcg - 300mcg por dose",
    protocol: "Injeção subcutânea 1 a 3 vezes ao dia, geralmente com Ipamorelina.",
    halfLife: "30 minutos",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/cjc-1295-no-dac-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL (2500 mcg/mL).",
    suppliesNeeded: "- Frasco CJC-1295 No DAC (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Focado em maximizar os picos naturais de GH sem causar dessensibilização.",
    dosingProtocol: "Comum: 100mcg (4 UI) antes de dormir ou ao acordar.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Também conhecido como Mod GRF 1-29.",
    howThisWorks: "Liga-se aos receptores de GHRH na pituitária para sinalizar a produção de GH.",
    lifestyleFactors: "Evitar carboidratos 2 horas antes e 30 min depois da injeção.",
    potentialBenefitsSideEffects: "Benefícios: Queima de gordura, ganho muscular, sono. Efeitos: Rubor facial.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Teichman SL, et al. (2006) - CJC-1295 clinical studies"
  });

  insert.run({
    id: "cjc-1295-with-dac-5mg",
    name: "CJC-1295 (Com DAC) (5mg)",
    category: "Longevidade & Anti-aging",
    description: "Versão de ação prolongada do CJC-1295 que mantém níveis elevados de GH por períodos extensos.",
    standardDosage: "2mg por semana",
    protocol: "Injeção subcut��nea uma vez por semana.",
    halfLife: "6-8 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/cjc-1295-with-dac-5mg-2/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco CJC-1295 With DAC (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Projetado para conveniência, eliminando a necessidade de injeções diárias múltiplas.",
    dosingProtocol: "Comum: 2mg (80 UI) uma vez por semana.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "O DAC (Drug Affinity Complex) permite que o peptídeo se ligue à albumina sanguínea.",
    howThisWorks: "Fornece estimulação contínua da liberação de GH ao longo da semana.",
    lifestyleFactors: "Monitorar níveis de IGF-1 periodicamente.",
    potentialBenefitsSideEffects: "Benefícios: Conveniência, níveis estáveis de GH. Efeitos: Retenção de água leve.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] J Clin Endocrinol Metab (2006) - CJC-1295 long-acting GHRH"
  });

  insert.run({
    id: "melanotan-2-10mg",
    name: "Melanotan 2 (10mg)",
    category: "Estética",
    description: "Análogo sintético do hormônio estimulador de melanócitos (alfa-MSH) que induz o bronzeamento da pele.",
    standardDosage: "250mcg - 500mcg por dose",
    protocol: "Injeção subcutânea diária até atingir a cor desejada, depois manutenção semanal.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/melanotan-2-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL (5000 mcg/mL).",
    suppliesNeeded: "- Frasco Melanotan 2 (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Ativa a produção de melanina independentemente da exposição UV, embora o sol acelere o processo.",
    dosingProtocol: "Fase de carga: 250mcg (5 UI) diário. Manutenção: 500mcg (10 UI) semanal.",
    storageInstructions: "Refrigerar a 2-8°C. Proteger da luz.",
    importantNotes: "Pode aumentar a libido e suprimir o apetite. Cuidado com o surgimento de novas sardas.",
    howThisWorks: "Agonista não seletivo dos receptores de melanocortina (MC1R, MC3R, MC4R, MC5R).",
    lifestyleFactors: "Exposição solar moderada otimiza o tom do bronzeado.",
    potentialBenefitsSideEffects: "Benefícios: Bronzeado profundo, fotoproteção. Efeitos: Náuseas, ereções espontâneas.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Dorr RT, et al. (1996) - Melanotan II and skin tanning\n[2] Hadley ME, et al. (2006) - Melanocortin receptors and tanning"
  });

  insert.run({
    id: "ghrp-2-5mg",
    name: "GHRP-2 (5mg)",
    category: "Longevidade & Anti-aging",
    description: "Secretagogo de hormônio do crescimento de segunda geração que estimula picos potentes de GH.",
    standardDosage: "100mcg - 200mcg por dose",
    protocol: "Injeção subcutânea 1 a 3 vezes ao dia.",
    halfLife: "30-60 minutos",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ghrp-2-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco GHRP-2 (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Mais potente que a Ipamorelina, mas pode causar um leve aumento na fome e no cortisol.",
    dosingProtocol: "Comum: 100mcg (4 UI) duas vezes ao dia.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Excelente para recuperação muscular e antienvelhecimento.",
    howThisWorks: "Atua como um agonista do receptor de grelina para sinalizar a liberação de GH.",
    lifestyleFactors: "Melhor administrado com o estômago vazio.",
    potentialBenefitsSideEffects: "Benefícios: Recuperação rápida, melhora da força. Efeitos: Fome aumentada.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Bowers CY. (1998) - GHRP-2 clinical pharmacology"
  });

  insert.run({
    id: "dsip-5mg",
    name: "DSIP (5mg)",
    category: "Sono & Recuperação",
    description: "Peptídeo indutor do sono profundo que regula os ritmos circadianos e reduz o estresse.",
    standardDosage: "100mcg - 250mcg por dose",
    protocol: "Injeção subcutânea antes de dormir conforme necessário.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/dsip-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco DSIP (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Não funciona como um sedativo clássico, mas ajuda o corpo a entrar em estados de sono reparador.",
    dosingProtocol: "Comum: 125mcg (5 UI) 30-60 minutos antes de dormir.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode ajudar na modulação da dor e na redução da ansiedade.",
    howThisWorks: "Modula a atividade elétrica no cérebro para favorecer o sono de ondas lentas.",
    lifestyleFactors: "Higiene do sono (quarto escuro, sem telas) potencializa o efeito.",
    potentialBenefitsSideEffects: "Benefícios: Sono profundo, redução de cortisol. Efeitos: Sonolência matinal (raro).",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Schoenenberger GA, et al. (1977) - DSIP isolation and effects\n[2] Pollard AS, et al. (1984) - DSIP in human sleep"
  });

  insert.run({
    id: "glutathione-1500mg",
    name: "Glutationa (1500mg)",
    category: "Imunidade",
    description: "O 'mestre antioxidante' do corpo, crucial para a desintoxicação hepática e proteção celular.",
    standardDosage: "200mg - 600mg por dose",
    protocol: "Injeção intramuscular ou subcutânea 1 a 3 vezes por semana.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/glutathione-1500mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 5.0 mL de água bacteriostática para uma concentração de 300 mg/mL.",
    suppliesNeeded: "- Frasco Glutationa (1500mg)\n- Seringas de Insulina ou IM\n- Água Bacteriostática",
    protocolOverview: "Neutraliza radicais livres e auxilia na reciclagem de outros antioxidantes como Vitamina C e E.",
    dosingProtocol: "Comum: 300mg (100 UI se 300mg/mL) duas vezes por semana.",
    storageInstructions: "Refrigerar a 2-8°C após reconstituição.",
    importantNotes: "Muito mais eficaz via injetável do que oral devido à degradação gástrica.",
    howThisWorks: "Atua como cofator para enzimas antioxidantes e se liga a toxinas para excreção.",
    lifestyleFactors: "Reduzir carga tóxica (álcool, poluição) ajuda a preservar os níveis.",
    potentialBenefitsSideEffects: "Benefícios: Pele radiante, desintoxicação, imunidade. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea ou Intramuscular.",
    references_content: "[1] Pizzorno J. (2014) - Glutathione! \n[2] Forman HJ, et al. (2009) - Glutathione: Synthesis and function"
  });

  insert.run({
    id: "klow-80mg",
    name: "KLOW (80mg)",
    category: "Recuperação & Cicatrização",
    description: "Blend de peptídeos de alta concentração para suporte regenerativo avançado.",
    standardDosage: "Variável",
    protocol: "Injeção subcutânea conforme orientação de pesquisa.",
    halfLife: "Variável",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/klow-80-mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~26.6 mg/mL.",
    suppliesNeeded: "- Frasco KLOW (80mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Blend proprietário focado em sinergia regenerativa.",
    dosingProtocol: "Protocolo específico de pesquisa dependendo do objetivo.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Alta concentração requer precisão na dosagem.",
    howThisWorks: "Combina múltiplos caminhos de sinalização para reparo tecidual.",
    lifestyleFactors: "Suporte nutricional adequado é essencial.",
    potentialBenefitsSideEffects: "Benefícios: Recuperação acelerada. Efeitos: Irritação local.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Research Literature on Peptide Blends"
  });

  insert.run({
    id: "slu-pp-322-5mg",
    name: "SLU-PP-322 (5mg)",
    category: "Perda de Peso & Metabólico",
    description: "Agonista seletivo do receptor nuclear ERR (Estrogen-Related Receptor) que imita os efeitos do exercício.",
    standardDosage: "Variável",
    protocol: "Protocolo de pesquisa em dias alternados ou diário.",
    halfLife: "Variável",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/slu-pp-322-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco SLU-PP-322 (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Aumenta o gasto energético e a oxidação de gordura sem alterar a ingestão de alimentos.",
    dosingProtocol: "Protocolo de pesquisa: 250mcg a 500mcg por dose.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Uma das moléculas mais promissoras para 'exercício em frasco'.",
    howThisWorks: "Ativa os receptores ERRα, ERRβ e ERRγ para aumentar a biogênese mitocondrial.",
    lifestyleFactors: "Pode ser usado para prevenir a perda muscular durante períodos de inatividade.",
    potentialBenefitsSideEffects: "Benefícios: Resistência aumentada, perda de gordura. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Billon C, et al. (2023) - Synthetic ERR agonists for metabolic disease"
  });

  insert.run({
    id: "melanotan-1-10mg",
    name: "Melanotan 1 (Afamelanotida) (10mg)",
    category: "Estética",
    description: "Análogo do alfa-MSH com perfil de segurança superior, utilizado para fotoproteção e bronzeamento.",
    standardDosage: "1mg diário",
    protocol: "Injeção subcutânea diária.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/melanotan-1-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco Melanotan 1 (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Induz o bronzeamento natural e protege a pele contra danos UV.",
    dosingProtocol: "Comum: 1mg (20 UI) por dia até atingir o tom desejado.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Menos efeitos colaterais na libido e apetite que o Melanotan 2.",
    howThisWorks: "Agonista seletivo do receptor MC1R.",
    lifestyleFactors: "Exposição solar mínima é necessária para ativar a pigmentação.",
    potentialBenefitsSideEffects: "Benefícios: Bronzeado seguro, fotoproteção. Efeitos: Náuseas leves.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Langendonk JG, et al. (2015) - Afamelanotide for erythropoietic protoporphyria"
  });

  insert.run({
    id: "foxo4-dri-10mg",
    name: "FOXO4-DRI (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo senolítico projetado para induzir apoptose seletiva em células senescentes.",
    standardDosage: "Variável",
    protocol: "Protocolo de pesquisa pulsado (ex: 3 doses em 5 dias).",
    halfLife: "Variável",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/foxo4-dri-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco FOXO4-DRI (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Alvo: Interação FOXO4-p53 para eliminar células 'zumbis' que causam inflamação sistêmica.",
    dosingProtocol: "Protocolo de pesquisa: 2mg a 5mg por dose em ciclos curtos.",
    storageInstructions: "Congelar a -20°C para armazenamento longo. Refrigerar após reconstituição.",
    importantNotes: "Potencial para reverter marcadores de envelhecimento em órgãos e tecidos.",
    howThisWorks: "Interrompe a ligação de FOXO4 com p53, permitindo que p53 induza a morte celular em células senescentes.",
    lifestyleFactors: "Suporte antioxidante pode ser benéfico durante a fase de eliminação celular.",
    potentialBenefitsSideEffects: "Benefícios: Rejuvenescimento tecidual, redução de inflamação. Efeitos: Fadiga temporária.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Baar MP, et al. (2017) - Targeted apoptosis of senescent cells by FOXO4-DRI"
  });

  insert.run({
    id: "ss-31-10mg",
    name: "SS-31 (Elamipretida) (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo protetor mitocondrial que estabiliza a cardiolipina e reduz o estresse oxidativo.",
    standardDosage: "10mg - 40mg diário",
    protocol: "Injeção subcutânea diária.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ss-31-elamipretide-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 1.0 mL de água bacteriostática para uma concentração de 10 mg/mL.",
    suppliesNeeded: "- Frasco SS-31 (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Restaura a bioenergética mitocondrial em tecidos com alta demanda energética (coração, rins, cérebro).",
    dosingProtocol: "Comum: 10mg (100 UI) por dia.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Estudado para insuficiência cardíaca e doenças mitocondriais raras.",
    howThisWorks: "Liga-se à cardiolipina na membrana mitocondrial interna para otimizar a cadeia de transporte de elétrons.",
    lifestyleFactors: "Dieta cetogênica pode ser sinérgica com a saúde mitocondrial.",
    potentialBenefitsSideEffects: "Benefícios: Melhora da função orgânica, energia celular. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Szeto HH. (2014) - Mitochondria-targeted peptides\n[2] Karaa A, et al. (2018) - Elamipretide in mitochondrial disease"
  });

  insert.run({
    id: "oxytocin-2mg",
    name: "Ocitocina (2mg)",
    category: "Cognição & Humor",
    description: "O 'hormônio do amor' ou 'hormônio do vínculo', regula o comportamento social e as respostas ao estresse.",
    standardDosage: "10 UI - 40 UI (Intranasal)",
    protocol: "Uso intranasal ou injeção subcutânea conforme necessário.",
    halfLife: "Muito curta (minutos)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/oxytocin-acetate-2mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 1 mg/mL.",
    suppliesNeeded: "- Frasco Ocitocina (2mg)\n- Spray Nasal ou Seringas\n- Água Bacteriostática",
    protocolOverview: "Promove a confiança, reduz a ansiedade social e auxilia na regulação emocional.",
    dosingProtocol: "Comum: 20-40 UI via spray nasal antes de interações sociais.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode influenciar a empatia e o reconhecimento de emoções faciais.",
    howThisWorks: "Atua como neurotransmissor no cérebro, modulando a amígdala e o sistema de recompensa.",
    lifestyleFactors: "O contato físico e a interação social aumentam naturalmente a ocitocina.",
    potentialBenefitsSideEffects: "Benefícios: Redução de ansiedade, melhor vínculo social. Efeitos: Alterações leves de humor.",
    injectionTechnique: "Intranasal ou Subcutânea.",
    references_content: "[1] MacDonald K, et al. (2010) - Oxytocin and social cognition\n[2] Guastella AJ, et al. (2012) - Oxytocin as a treatment for social anxiety"
  });

  insert.run({
    id: "snap-8-10mg",
    name: "Snap-8 (10mg)",
    category: "Estética",
    description: "Octapeptídeo anti-rugas que reduz a profundidade das rugas causadas pelas contrações dos músculos faciais.",
    standardDosage: "Tópico (geralmente 3-10%)",
    protocol: "Aplicação tópica em cremes ou injeção localizada em protocolos de pesquisa.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/snap-8-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nPara uso em pesquisa: Reconstituir em água bacteriostática ou soro fisiológico.",
    suppliesNeeded: "- Frasco Snap-8 (10mg)\n- Água Bacteriostática",
    protocolOverview: "Alternativa tópica ao Botox, atuando no complexo SNARE para relaxar os músculos faciais.",
    dosingProtocol: "Uso tópico diário em formulações cosméticas.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Extensão do peptídeo Argireline, com maior eficácia.",
    howThisWorks: "Bloqueia a liberação de acetilcolina na fenda sináptica, reduzindo a contração muscular.",
    lifestyleFactors: "Proteção solar e hidratação da pele complementam o efeito anti-rugas.",
    potentialBenefitsSideEffects: "Benefícios: Redução de linhas de expressão. Efeitos: Mínimos.",
    injectionTechnique: "Tópico ou Subcutâneo localizado.",
    references_content: "[1] Blanes-Mira C, et al. (2002) - A synthetic hexapeptide (Argireline) with antiwrinkle activity"
  });

  insert.run({
    id: "kisspeptin-10-5mg",
    name: "Kisspeptina-10 (5mg)",
    category: "Saúde Sexual",
    description: "Peptídeo regulador mestre do eixo reprodutivo, estimulando a liberação de GnRH, LH e FSH.",
    standardDosage: "1mcg/kg de peso corporal",
    protocol: "Injeção subcutânea diária ou pulsada.",
    halfLife: "Curta (minutos)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/kisspeptin-10-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco Kisspeptina-10 (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Aumenta a produção natural de testosterona e melhora a função reprodutiva.",
    dosingProtocol: "Comum: 100mcg (4 UI) por dia.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode ser usado para restaurar o eixo HPTA após supressão.",
    howThisWorks: "Ativa os neurônios GnRH no hipotálamo via receptor KISS1R.",
    lifestyleFactors: "Monitorar níveis hormonais (LH, FSH, Testosterona).",
    potentialBenefitsSideEffects: "Benefícios: Aumento da libido, fertilidade, testosterona. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Dhillo WS, et al. (2005) - Kisspeptin-10 stimulates hormone release in humans\n[2] Jayasena CN, et al. (2014) - Kisspeptin-10 and reproductive health"
  });

  insert.run({
    id: "fox04-10mg",
    name: "FOX04 (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo de pesquisa focado na regulação do ciclo celular e potencial senolítico.",
    standardDosage: "Variável",
    protocol: "Protocolo de pesquisa específico.",
    halfLife: "Variável",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/fox04-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco FOX04 (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Estudado por sua interação com p53 e papel na senescência celular.",
    dosingProtocol: "Protocolo de pesquisa: 1mg a 3mg por dose.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Versão base do peptídeo senolítico FOXO4-DRI.",
    howThisWorks: "Modula a via de sinalização FOXO4 para influenciar a sobrevivência celular.",
    lifestyleFactors: "Manter ambiente laboratorial controlado.",
    potentialBenefitsSideEffects: "Benefícios: Potencial senolítico. Efeitos: Não totalmente documentados.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Baar MP, et al. (2017) - FOXO4-p53 interference"
  });

  insert.run({
    id: "semax-nasal-10mg",
    name: "Semax Nasal Spray (10mg)",
    category: "Cognição & Humor",
    description: "Versão em spray nasal do Semax para absorção rápida e direta no sistema nervoso central.",
    standardDosage: "2-3 jatos por narina",
    protocol: "Uso intranasal 1 a 2 vezes ao dia.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/semax-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nProduto pronto para uso ou requer reconstituição no frasco de spray nasal fornecido.",
    suppliesNeeded: "- Frasco Spray Nasal Semax\n- Água Bacteriostática (se necessário)",
    protocolOverview: "Focado em clareza mental imediata e recuperação neuroprotetora.",
    dosingProtocol: "1 jato (aprox. 500mcg) em cada narina pela manhã.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "A via intranasal ignora a barreira hematoencefálica de forma mais eficiente.",
    howThisWorks: "Aumenta rapidamente os níveis de BDNF no cérebro.",
    lifestyleFactors: "Ideal para períodos de alta demanda cognitiva.",
    potentialBenefitsSideEffects: "Benefícios: Foco, memória, redução de fadiga mental. Efeitos: Irritação nasal leve.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Shabanov PD, et al. (2017) - Intranasal Semax in neurorehabilitation"
  });

  insert.run({
    id: "selank-nasal-10mg",
    name: "Selank Nasal Spray (10mg)",
    category: "Cognição & Humor",
    description: "Spray nasal de Selank para alívio rápido da ansiedade e melhoria do foco sem sedação.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal conforme necessário ou 2-3 vezes ao dia.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/selank-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAdministrar via spray nasal para absorção sistêmica rápida.",
    suppliesNeeded: "- Frasco Spray Nasal Selank",
    protocolOverview: "Ansiolítico nootrópico que modula a resposta ao estresse.",
    dosingProtocol: "2 jatos em cada narina quando sentir ansiedade ou antes de eventos estressantes.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Não causa dependência ou sonolência comum em benzodiazepínicos.",
    howThisWorks: "Modula os receptores GABA e aumenta os níveis de serotonina.",
    lifestyleFactors: "Pode ser usado durante o dia sem afetar a coordenação motora.",
    potentialBenefitsSideEffects: "Benefícios: Calma, redução de estresse, foco. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Kolomin T, et al. (2014) - Selank and gene expression in the brain"
  });

  insert.run({
    id: "melanotan-2-nasal-10mg",
    name: "Melanotan 2 Nasal Spray (10mg)",
    category: "Estética",
    description: "Forma intranasal de Melanotan 2 para quem prefere evitar injeções para o bronzeamento.",
    standardDosage: "2 jatos por narina diários",
    protocol: "Uso intranasal diário até atingir o tom desejado.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/melanotan-2-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nReconstituir o pó com água bacteriostática e transferir para o frasco de spray nasal.",
    suppliesNeeded: "- Kit Melanotan 2 Nasal\n- Água Bacteriostática",
    protocolOverview: "Bronzeamento sistêmico via absorção pela mucosa nasal.",
    dosingProtocol: "2 jatos em cada narina, 1-2 vezes ao dia.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "A biodisponibilidade nasal é menor que a injetável (aprox. 30-50%), requerendo doses maiores.",
    howThisWorks: "Estimula os melanócitos via receptores de melanocortina.",
    lifestyleFactors: "Exposição solar leve ainda é recomendada para melhores resultados.",
    potentialBenefitsSideEffects: "Benefícios: Bronzeado sem agulhas. Efeitos: Náuseas, espirros.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Evans J. (2013) - Tanning with nasal peptides"
  });

  insert.run({
    id: "bpc-157-nasal-10mg",
    name: "BPC-157 Nasal Spray (10mg)",
    category: "Recuperação & Cicatrização",
    description: "Spray nasal de BPC-157 focado em neuroproteção e recuperação de lesões cerebrais ou inflamação sistêmica.",
    standardDosage: "1-2 jatos por narina",
    protocol: "Uso intranasal 1 a 2 vezes ao dia.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/bpc-157-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nIdeal para atingir o sistema nervoso central através da via olfativa.",
    suppliesNeeded: "- Frasco Spray Nasal BPC-157",
    protocolOverview: "Apoia a cura de tecidos neurais e modula o eixo intestino-cérebro.",
    dosingProtocol: "200mcg a 400mcg via intranasal diariamente.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Estudado para concussões e declínio cognitivo inflamatório.",
    howThisWorks: "Promove a angiogênese e reduz citocinas inflamatórias no cérebro.",
    lifestyleFactors: "Suporte com ômega-3 potencializa a neuroproteção.",
    potentialBenefitsSideEffects: "Benefícios: Recuperação cognitiva, redução de neuroinflamação. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Sikiric P, et al. (2016) - BPC 157 and the brain"
  });

  insert.run({
    id: "tb-500-nasal-10mg",
    name: "TB-500 Nasal Spray (10mg)",
    category: "Recuperação & Cicatrização",
    description: "Versão intranasal de TB-500 para suporte sistêmico à cura e redução de inflamação.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal 2 a 3 vezes por semana.",
    halfLife: "Longa (sistêmica)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tb-500-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAbsorção via mucosa nasal para distribuição sistêmica.",
    suppliesNeeded: "- Frasco Spray Nasal TB-500",
    protocolOverview: "Promove a regeneração de tecidos e reduz a formação de cicatrizes.",
    dosingProtocol: "1mg a 2mg via intranasal por semana, dividido em doses.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Menos invasivo que injeções, ideal para manutenção a longo prazo.",
    howThisWorks: "Aumenta a expressão de actina para facilitar a cura tecidual.",
    lifestyleFactors: "Manter atividade física leve para promover a circulação.",
    potentialBenefitsSideEffects: "Benefícios: Cura sistêmica, flexibilidade. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Philp D, et al. (2003) - Thymosin beta4 and tissue repair"
  });

  insert.run({
    id: "mots-c-nasal-10mg",
    name: "MOTS-C Nasal Spray (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Forma intranasal do MOTS-C para suporte metabólico e melhoria da performance física.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal 1 a 2 vezes por semana.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/mots-c-10mg-nasal-spray/",
    dosingReconstitutionGuide: "### Guia de Uso\nAdministração via mucosa nasal para rápida absorção metabólica.",
    suppliesNeeded: "- Frasco Spray Nasal MOTS-C",
    protocolOverview: "Apoia a biogênese mitocondrial e a regulação da glicose.",
    dosingProtocol: "1-2 jatos em cada narina antes do exercício.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Ideal para quem busca os benefícios metabólicos do MOTS-C sem injeções.",
    howThisWorks: "Ativa as vias de sinalização mitocondrial sistemicamente.",
    lifestyleFactors: "Combine com atividade física para maximizar os resultados.",
    potentialBenefitsSideEffects: "Benefícios: Energia aumentada, flexibilidade metabólica. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Lee C, et al. (2015) - MOTS-c and metabolic homeostasis"
  });

  insert.run({
    id: "retatrutide-nasal-10mg",
    name: "Retatrutida Nasal Spray (10mg)",
    category: "Perda de Peso & Metabólico",
    description: "Versão em spray nasal da Retatrutida para controle de peso e regulação metabólica.",
    standardDosage: "1-2 jatos por narina",
    protocol: "Uso intranasal semanal ou conforme protocolo de pesquisa.",
    halfLife: "6 dias (sistêmica)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/retatrutide-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAbsorção via mucosa nasal para atingir os receptores de incretina.",
    suppliesNeeded: "- Frasco Spray Nasal Retatrutida",
    protocolOverview: "Triplo agonista focado em supressão de apetite e queima de gordura.",
    dosingProtocol: "Protocolo de pesquisa: 1 jato em cada narina uma vez por semana.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "A biodisponibilidade nasal pode variar; monitorar resposta metabólica.",
    howThisWorks: "Ativa receptores GLP-1, GIP e Glucagon.",
    lifestyleFactors: "Manter dieta equilibrada durante o uso.",
    potentialBenefitsSideEffects: "Benefícios: Perda de peso, saciedade. Efeitos: Náuseas leves.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] NEJM (2023) - Retatrutide for Obesity"
  });

  insert.run({
    id: "tirzepatide-nasal-10mg",
    name: "Tirzepatida Nasal Spray (10mg)",
    category: "Perda de Peso & Metabólico",
    description: "Spray nasal de Tirzepatida para suporte na perda de peso e saúde metabólica.",
    standardDosage: "1-2 jatos por narina",
    protocol: "Uso intranasal semanal.",
    halfLife: "5 dias (sistêmica)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tirzepatide-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAdministração prática via spray nasal para regulação de glicose e apetite.",
    suppliesNeeded: "- Frasco Spray Nasal Tirzepatida",
    protocolOverview: "Duplo agonista GIP/GLP-1 para resultados metabólicos potentes.",
    dosingProtocol: "1 jato em cada narina semanalmente.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Alternativa às injeções semanais de Tirzepatida.",
    howThisWorks: "Imita as incretinas naturais para melhorar a resposta à insulina.",
    lifestyleFactors: "Exercícios regulares potencializam a perda de gordura.",
    potentialBenefitsSideEffects: "Benefícios: Controle glicêmico, perda de peso. Efeitos: Desconforto gástrico leve.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] NEJM (2022) - Tirzepatide Once Weekly for Obesity"
  });

  insert.run({
    id: "ipamorelin-nasal-10mg",
    name: "Ipamorelina Nasal Spray (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Spray nasal de Ipamorelina para estimulação natural do hormônio do crescimento.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal diário, preferencialmente à noite.",
    halfLife: "2 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ipamorelin-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAbsorção rápida via mucosa nasal para picos pulsáteis de GH.",
    suppliesNeeded: "- Frasco Spray Nasal Ipamorelina",
    protocolOverview: "Promove a recuperação celular e melhora a composição corporal.",
    dosingProtocol: "2 jatos em cada narina antes de dormir.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Não afeta os níveis de cortisol ou prolactina.",
    howThisWorks: "Agonista do receptor de grelina.",
    lifestyleFactors: "Sono de qualidade é fundamental para os benefícios do GH.",
    potentialBenefitsSideEffects: "Benefícios: Melhora do sono, pele e recuperação. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] PubMed - Ipamorelin studies"
  });

  insert.run({
    id: "ghk-cu-nasal-50mg",
    name: "GHK-Cu Nasal Spray (50mg)",
    category: "Recuperação & Cicatrização",
    description: "Spray nasal de GHK-Cu focado em neuroproteção e regeneração sistêmica.",
    standardDosage: "1-2 jatos por narina",
    protocol: "Uso intranasal diário.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ghk-cu-nasal-spray-50mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nVia olfativa para acesso direto ao sistema nervoso central.",
    suppliesNeeded: "- Frasco Spray Nasal GHK-Cu",
    protocolOverview: "Apoia a saúde cognitiva e a reparação de tecidos neurais.",
    dosingProtocol: "1 jato em cada narina, 1-2 vezes ao dia.",
    storageInstructions: "Refrigerar a 2-8°C. Proteger da luz.",
    importantNotes: "Pode ajudar na recuperação de anosmia ou danos nervosos.",
    howThisWorks: "Modula genes de reparo e reduz a inflamação cerebral.",
    lifestyleFactors: "Suporte com antioxidantes é recomendado.",
    potentialBenefitsSideEffects: "Benefícios: Clareza mental, reparo neural. Efeitos: Irritação nasal leve.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Pickart L. (2015) - GHK-Cu and brain health"
  });

  insert.run({
    id: "epithalon-nasal-10mg",
    name: "Epithalon Nasal Spray (10mg)",
    category: "Longevidade & Anti-aging",
    description: "Versão nasal do Epithalon para regulação pineal e suporte à longevidade.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal diário em ciclos.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/epithalon-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAdministração prática para suporte aos ritmos circadianos.",
    suppliesNeeded: "- Frasco Spray Nasal Epithalon",
    protocolOverview: "Focado na ativação da telomerase e normalização da melatonina.",
    dosingProtocol: "2 jatos em cada narina pela manhã ou noite.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Excelente para mitigar os efeitos do jet lag e envelhecimento celular.",
    howThisWorks: "Atua na glândula pineal para regular a secreção hormonal.",
    lifestyleFactors: "Evitar luz azul à noite para apoiar a melatonina natural.",
    potentialBenefitsSideEffects: "Benefícios: Sono reparador, longevidade. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Khavinson V. - Epithalon and aging"
  });

  insert.run({
    id: "kisspeptin-10-nasal-5mg",
    name: "Kisspeptina-10 Nasal Spray (5mg)",
    category: "Saúde Sexual",
    description: "Spray nasal de Kisspeptina-10 para suporte hormonal reprodutivo rápido.",
    standardDosage: "1-2 jatos por narina",
    protocol: "Uso intranasal conforme necessário ou diário.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/kisspeptin-10-nasal-spray-5mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAbsorção nasal para estímulo direto do eixo HPTA.",
    suppliesNeeded: "- Frasco Spray Nasal Kisspeptina-10",
    protocolOverview: "Aumenta a libido e a produção natural de gonadotrofinas.",
    dosingProtocol: "1-2 jatos em cada narina diariamente.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode ser usado como alternativa ao HCG em alguns protocolos.",
    howThisWorks: "Estimula a liberação de GnRH no hipotálamo.",
    lifestyleFactors: "Monitorar níveis de testosterona e LH.",
    potentialBenefitsSideEffects: "Benefícios: Libido aumentada, fertilidade. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Jayasena CN, et al. (2014) - Kisspeptin-10 and reproductive health"
  });

  insert.run({
    id: "nad-plus-nasal-1000mg",
    name: "NAD+ Nasal Spray (1000mg)",
    category: "Longevidade & Anti-aging",
    description: "Spray nasal de NAD+ para clareza mental imediata e foco cognitivo.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal 1 a 3 vezes ao dia.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/nad-plus-nasal-spray-1000mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nVia direta para o cérebro para suporte mitocondrial neural.",
    suppliesNeeded: "- Frasco Spray Nasal NAD+",
    protocolOverview: "Restaura os níveis de NAD+ no cérebro, combatendo a névoa mental.",
    dosingProtocol: "2 jatos em cada narina quando precisar de foco extra.",
    storageInstructions: "Refrigerar a 2-8°C. Muito sensível.",
    importantNotes: "Pode causar um leve formigamento nasal temporário.",
    howThisWorks: "Aumenta a disponibilidade de NAD+ para as sirtuínas cerebrais.",
    lifestyleFactors: "Ideal para trabalho intelectual intenso.",
    potentialBenefitsSideEffects: "Benefícios: Foco, clareza mental, energia. Efeitos: Irritação nasal leve.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Rajman L, et al. (2018) - NAD-boosting molecules"
  });

  insert.run({
    id: "pt-141-nasal-10mg",
    name: "PT-141 Nasal Spray (10mg)",
    category: "Saúde Sexual",
    description: "Spray nasal de PT-141 para aumento da libido e resposta sexual.",
    standardDosage: "2-4 jatos por narina",
    protocol: "Uso intranasal conforme necessário.",
    halfLife: "2-3 horas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/pt-141-nasal-spray-10mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nAdministrar 1-2 horas antes da atividade sexual.",
    suppliesNeeded: "- Frasco Spray Nasal PT-141",
    protocolOverview: "Ativa as vias neurais do desejo sexual.",
    dosingProtocol: "2 jatos em cada narina conforme necessário.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode causar náuseas; começar com dose baixa.",
    howThisWorks: "Agonista do receptor de melanocortina no SNC.",
    lifestyleFactors: "Ambiente relaxado e estimulação natural ajudam.",
    potentialBenefitsSideEffects: "Benefícios: Libido aumentada. Efeitos: Náuseas, rubor.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Safarinejad MR. (2008) - PT-141 in sexual dysfunction"
  });

  insert.run({
    id: "ghrp-2-nasal-5mg",
    name: "GHRP-2 Nasal Spray (5mg)",
    category: "Longevidade & Anti-aging",
    description: "Spray nasal de GHRP-2 para estimulação potente de GH via intranasal.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal 1 a 2 vezes ao dia.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/ghrp-2-5mg-nasal-spray/",
    dosingReconstitutionGuide: "### Guia de Uso\nAbsorção rápida para picos imediatos de hormônio do crescimento.",
    suppliesNeeded: "- Frasco Spray Nasal GHRP-2",
    protocolOverview: "Apoia a recuperação muscular e o metabolismo.",
    dosingProtocol: "2 jatos em cada narina pela manhã ou após o treino.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode aumentar o apetite logo após o uso.",
    howThisWorks: "Agonista do receptor de grelina.",
    lifestyleFactors: "Treino de força potencializa os resultados.",
    potentialBenefitsSideEffects: "Benefícios: Recuperação, força. Efeitos: Fome aumentada.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Bowers CY. (1998) - GHRP-2 pharmacology"
  });

  insert.run({
    id: "glutathione-nasal-600mg",
    name: "Glutationa Nasal Spray (600mg)",
    category: "Imunidade",
    description: "Spray nasal de Glutationa para suporte antioxidante cerebral e desintoxicação.",
    standardDosage: "2 jatos por narina",
    protocol: "Uso intranasal 1 a 2 vezes ao dia.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/glutathione-nasal-spray-600mg/",
    dosingReconstitutionGuide: "### Guia de Uso\nVia direta para o cérebro para neutralizar o estresse oxidativo neural.",
    suppliesNeeded: "- Frasco Spray Nasal Glutationa",
    protocolOverview: "Apoia a saúde neurológica e a função imunológica.",
    dosingProtocol: "2 jatos em cada narina diariamente.",
    storageInstructions: "Refrigerar a 2-8°C.",
    importantNotes: "Pode ter um odor sulfuroso característico.",
    howThisWorks: "Atua como o principal antioxidante endógeno no cérebro.",
    lifestyleFactors: "Reduzir exposição a toxinas ambientais.",
    potentialBenefitsSideEffects: "Benefícios: Neuroproteção, imunidade. Efeitos: Mínimos.",
    injectionTechnique: "Intranasal.",
    references_content: "[1] Pizzorno J. (2014) - Glutathione!"
  });

  insert.run({
    id: "semaglutide-5mg",
    name: "Semaglutida (5mg)",
    category: "Perda de Peso & Metabólico",
    description: "Agonista do receptor GLP-1 que regula o apetite e o açúcar no sangue, amplamente utilizado para perda de peso.",
    standardDosage: "0.25mg - 2.4mg semanal",
    protocol: "Injeção subcutânea semanal com titulação gradual.",
    halfLife: "7 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/semaglutide-5mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 2.5 mg/mL.",
    suppliesNeeded: "- Frasco Semaglutida (5mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Imita o hormônio incretina GLP-1 para aumentar a saciedade e retardar o esvaziamento gástrico.",
    dosingProtocol: "Mês 1: 0.25mg (10 UI)\nMês 2: 0.5mg (20 UI)\nMês 3: 1.0mg (40 UI)\nMês 4+: 1.7mg a 2.4mg",
    storageInstructions: "Refrigerar após reconstituição. Proteger da luz.",
    importantNotes: "Pode causar náuseas e desconforto gastrointestinal, especialmente no início.",
    howThisWorks: "Ativa os centros de saciedade no cérebro e melhora a secreção de insulina dependente de glicose.",
    lifestyleFactors: "Dieta hipocalórica e exercícios potencializam os resultados.",
    potentialBenefitsSideEffects: "Benefícios: Perda de peso sustentada, controle glicêmico. Efeitos: Náuseas, vômitos.",
    injectionTechnique: "Subcutânea semanal.",
    references_content: "[1] NEJM (2021) - Once-Weekly Semaglutide in Adults with Overweight or Obesity"
  });

  insert.run({
    id: "tirzepatide-10mg",
    name: "Tirzepatida (10mg)",
    category: "Perda de Peso & Metabólico",
    description: "Duplo agonista dos receptores GIP e GLP-1, oferecendo eficácia superior para perda de peso e controle glicêmico.",
    standardDosage: "2.5mg - 15mg semanal",
    protocol: "Injeção subcutânea semanal com titulação a cada 4 semanas.",
    halfLife: "5 dias",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://researchpeptideseurope.com/product/tirzepatide-10mg/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 5 mg/mL.",
    suppliesNeeded: "- Frasco Tirzepatida (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Conhecido como 'twincretin', combina dois caminhos de incretina para resultados metabólicos sinérgicos.",
    dosingProtocol: "Início: 2.5mg (50 UI) por 4 semanas. Aumentar 2.5mg a cada 4 semanas conforme tolerado, até 15mg.",
    storageInstructions: "Refrigerar a 2-8°C. Proteger da luz.",
    importantNotes: "Demonstrou perda de peso de até 21% em ensaios clínicos de longo prazo.",
    howThisWorks: "Ativa receptores GIP e GLP-1 para melhorar a secreção de insulina, suprimir o apetite e aumentar o gasto energético.",
    lifestyleFactors: "Monitorar ingestão calórica e hidratação.",
    potentialBenefitsSideEffects: "Benefícios: Perda de peso potente, melhora lipídica. Efeitos: Gastrointestinais.",
    injectionTechnique: "Subcutânea semanal.",
    references_content: "[1] NEJM (2022) - Tirzepatide Once Weekly for the Treatment of Obesity"
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/peptides", (req, res) => {
    const peptides = db.prepare("SELECT * FROM peptides").all();
    // Map references_content to references for the client
    const mapped = peptides.map((p: any) => ({
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
        VALUES (
          @id, @name, @category, @description, @standardDosage, @protocol, @halfLife, @image, @supplierLink,
          @dosingReconstitutionGuide, @suppliesNeeded, @protocolOverview, @dosingProtocol, @storageInstructions,
          @importantNotes, @howThisWorks, @lifestyleFactors, @potentialBenefitsSideEffects, @injectionTechnique, @references
        )
      `).run({ 
        id, name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
        dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
        importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references
      });
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
        SET name = @name, category = @category, description = @description, standardDosage = @standardDosage, 
            protocol = @protocol, halfLife = @halfLife, image = @image, supplierLink = @supplierLink,
            dosingReconstitutionGuide = @dosingReconstitutionGuide, suppliesNeeded = @suppliesNeeded,
            protocolOverview = @protocolOverview, dosingProtocol = @dosingProtocol, storageInstructions = @storageInstructions,
            importantNotes = @importantNotes, howThisWorks = @howThisWorks, lifestyleFactors = @lifestyleFactors,
            potentialBenefitsSideEffects = @potentialBenefitsSideEffects, injectionTechnique = @injectionTechnique,
            references_content = @references
        WHERE id = @id
      `).run({ 
        id: req.params.id, name, category, description, standardDosage, protocol, halfLife, image, supplierLink,
        dosingReconstitutionGuide, suppliesNeeded, protocolOverview, dosingProtocol, storageInstructions,
        importantNotes, howThisWorks, lifestyleFactors, potentialBenefitsSideEffects, injectionTechnique, references
      });
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
        Gere informações detalhadas sobre o peptídeo "${name}" para um site educacional.
        O site é focado em pesquisa e educação sobre peptídeos.
        Retorne os dados estritamente no seguinte formato JSON:
        {
          "id": "nome-formatado-com-hifens",
          "name": "Nome do Peptídeo",
          "category": "Categoria (ex: Perda de Peso, Recuperação, Longevidade, Cognição, Imunidade)",
          "description": "Breve descrição de 1 a 2 frases.",
          "standardDosage": "Dosagem padrão (ex: 250mcg - 500mcg)",
          "protocol": "Protocolo de uso comum para pesquisa.",
          "halfLife": "Meia-vida estimada",
          "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
          "supplierLink": "https://researchpeptideseurope.com/",
          "dosingReconstitutionGuide": "Conteúdo em Markdown sobre dosagem e reconstituição.",
          "suppliesNeeded": "Conteúdo em Markdown sobre suprimentos necessários.",
          "protocolOverview": "Conteúdo em Markdown com visão geral do protocolo.",
          "dosingProtocol": "Conteúdo em Markdown detalhando o protocolo de dosagem.",
          "storageInstructions": "Conteúdo em Markdown sobre instruções de armazenamento.",
          "importantNotes": "Conteúdo em Markdown com notas importantes.",
          "howThisWorks": "Conteúdo em Markdown explicando como funciona.",
          "lifestyleFactors": "Conteúdo em Markdown sobre fatores de estilo de vida.",
          "potentialBenefitsSideEffects": "Conteúdo em Markdown sobre benefícios e efeitos colaterais.",
          "injectionTechnique": "Conteúdo em Markdown sobre técnica de injeção.",
          "references": "Conteúdo em Markdown com referências científicas."
        }
        IMPORTANTE: Todo o conteúdo deve estar em PORTUGUÊS.
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
