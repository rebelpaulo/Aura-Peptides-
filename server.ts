import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";

const db = new Database("peptides.db");

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
    supplierLink: "https://peptidedosages.com/peptide-blend-dosages/glow-70-mg-vial-dosage-protocol/",
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
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/retatrutide-10mg-vial-dosage-protocol/",
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
    id: "mazdutide-10mg",
    name: "Mazdutida (10mg)",
    category: "Perda de Peso & Metabólico",
    description: "Agonista duplo GLP-1/Glucagon de longa duração para controle de peso e diabetes tipo 2.",
    standardDosage: "2.5mg - 5mg semanal",
    protocol: "Injeção semanal subcutânea com titulação gradual.",
    halfLife: "Longa duração",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/mazdutide-10mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~3.33 mg/mL.",
    suppliesNeeded: "- Frasco Mazdutida (10mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Demonstrou perda de peso de 6-14% em ensaios clínicos de fase 2 e 3.",
    dosingProtocol: "Semanas 1-4: 2.5mg (75 UI)\nSemanas 5-8+: 5mg (150 UI)",
    storageInstructions: "Refrigerar após reconstituição. Evitar ciclos de congelamento/descongelamento.",
    importantNotes: "Protocolos de alta dose (7.5-10mg) requerem monitoramento clínico cuidadoso.",
    howThisWorks: "Combina saciedade via GLP-1 com aumento de oxidação lipídica via Glucagon.",
    lifestyleFactors: "Monitorar frequência cardíaca, que pode aumentar levemente.",
    potentialBenefitsSideEffects: "Benefícios: Perda de peso, melhora de marcadores metabólicos. Efeitos: Gastrointestinais leves.",
    injectionTechnique: "Subcutânea semanal.",
    references_content: "[1] Nature (2024) - Mazdutide Phase 2 Results"
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
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/ipamorelin-10mg-vial-dosage-protocol/",
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
    id: "vilon-20mg",
    name: "Vilon (20mg)",
    category: "Imunidade",
    description: "Dipeptídeo imunorregulador sintético (Lys-Glu) estudado para rejuvenescimento do timo.",
    standardDosage: "67mcg - 670mcg diário",
    protocol: "Ciclo pulsado: 5 dias consecutivos por mês.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/vilon-20mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~6.67 mg/mL.",
    suppliesNeeded: "- Frasco Vilon (20mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Focado na modulação imunológica e descondensação da cromatina em células envelhecidas.",
    dosingProtocol: "Dia 1: 67mcg (1 UI)\nDia 2: 133mcg (2 UI)\nDia 3: 200mcg (3 UI)\nDia 4: 267mcg (4 UI)\nDia 5: 333mcg (5 UI)\nCiclos futuros: 333-667mcg (5-10 UI)",
    storageInstructions: "Refrigerar. Usar em até 1 semana após reconstituição ou congelar alíquotas.",
    importantNotes: "Protocolo de 5 dias seguido de descanso de 3 semanas.",
    howThisWorks: "Aumenta a expressão de IL-2 e reativa genes ribossomais.",
    lifestyleFactors: "Reduzir estresse para apoiar a função tímica.",
    potentialBenefitsSideEffects: "Benefícios: Fortalecimento do sistema imune. Efeitos: Não relatados.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Khavinson V. - Peptide bioregulation of aging"
  });

  insert.run({
    id: "vesugen-20mg",
    name: "Vesugen (20mg)",
    category: "Saúde Cardiovascular",
    description: "Tripeptídeo biorregulador (Lys-Glu-Asp) para o endotélio vascular e neuroplasticidade.",
    standardDosage: "500mcg - 2000mcg diário",
    protocol: "Injeção subcutânea diária com titulação gradual.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/vesugen-20mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~6.67 mg/mL.",
    suppliesNeeded: "- Frasco Vesugen (20mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Suporta a proliferação de células endoteliais e a homeostase microvascular.",
    dosingProtocol: "Semana 1: 500mcg (7.5 UI)\nSemana 2: 1000mcg (15 UI)\nSemana 3: 1500mcg (22.5 UI)\nSemanas 4-8+: 1500-2000mcg (22.5-30 UI)",
    storageInstructions: "Refrigerar a 2-8°C. Evitar luz e calor.",
    importantNotes: "Seringas de 50 unidades melhoram a precisão para doses fracionadas.",
    howThisWorks: "Regulação epigenética da expressão gênica no endotélio vascular.",
    lifestyleFactors: "Exercícios aeróbicos leves apoiam a saúde vascular.",
    potentialBenefitsSideEffects: "Benefícios: Melhora da circulação, proteção neuronal. Efeitos: Mínimos.",
    injectionTechnique: "Subcutânea diária.",
    references_content: "[1] Khavinson V. - Vascular bioregulation"
  });

  insert.run({
    id: "ovagen-20mg",
    name: "Ovagen (20mg)",
    category: "Recuperação & Cicatrização",
    description: "Tripeptídeo sintético (Glu-Asp-Leu) biorregulador do fígado e trato gastrointestinal.",
    standardDosage: "10mcg - 150mcg diário",
    protocol: "Injeção subcutânea diária com titulação lenta.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/ovagen-20mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 10 mg/mL (10.000 mcg/mL).",
    suppliesNeeded: "- Frasco Ovagen (20mg)\n- Seringas de Insulina (30 ou 50 unidades recomendadas)\n- Água Bacteriostática",
    protocolOverview: "Aumenta a proliferação celular e modula marcadores gênicos relacionados ao envelhecimento.",
    dosingProtocol: "Semanas 1-2: 10mcg (0.1 UI)\nSemanas 3-4: 20mcg (0.2 UI)\nSemanas 5-6: 50mcg (0.5 UI)\nSemanas 7-8: 100mcg (1 UI)\nSemanas 9-16: 100-150mcg (1-1.5 UI)",
    storageInstructions: "Refrigerar a 2-8°C após reconstituição. Evitar ciclos de gelo.",
    importantNotes: "Doses extremamente baixas; requer seringas de alta precisão.",
    howThisWorks: "Interage com o DNA para regular a função hepática e digestiva.",
    lifestyleFactors: "Evitar álcool e toxinas hepáticas durante o protocolo.",
    potentialBenefitsSideEffects: "Benefícios: Regeneração hepática, melhora digestiva. Efeitos: Não relatados.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Khavinson V. - Liver bioregulation studies"
  });

  insert.run({
    id: "pnc-27-30mg",
    name: "PNC-27 (30mg)",
    category: "Imunidade",
    description: "Peptídeo quimérico anticancerígeno que induz necrose seletiva em células tumorais.",
    standardDosage: "100mcg - 500mcg diário",
    protocol: "Injeção subcutânea diária com titulação gradual.",
    halfLife: "Variável",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/pnc-27-30-mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de 10 mg/mL.",
    suppliesNeeded: "- Frasco PNC-27 (30mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Alvo: HDM2 na membrana de células tumorais, formando poros que causam necrose.",
    dosingProtocol: "Semanas 1-2: 100mcg (1 UI)\nSemanas 3-4: 200mcg (2 UI)\nSemanas 5-8: 300mcg (3 UI)\nSemanas 9-12: 400mcg (4 UI)\nSemanas 13-16: 500mcg (5 UI)",
    storageInstructions: "Liofilizado: -20°C. Reconstituído: 2-8°C.",
    importantNotes: "Apenas para fins de pesquisa laboratorial. Sem ensaios clínicos humanos publicados.",
    howThisWorks: "Liga-se ao HDM2 aberrante na superfície de células cancerosas para criar poros letais.",
    lifestyleFactors: "Suporte imunológico geral é recomendado.",
    potentialBenefitsSideEffects: "Benefícios: Citotoxicidade seletiva contra tumores. Efeitos: Reações no local da injeção.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Michl J, et al. (2006) - PNC-27 and cancer cell lysis"
  });

  insert.run({
    id: "prostamax-20mg",
    name: "Prostamax (20mg)",
    category: "Saúde Sexual",
    description: "Tetrapeptídeo biorregulador (Lys-Glu-Asp-Pro) para a saúde da próstata.",
    standardDosage: "500mcg - 1mg diário",
    protocol: "Injeção intramuscular diária por 15-60 dias.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/prostamax-20mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 2.0 mL de água bacteriostática para uma concentração de 10 mg/mL.",
    suppliesNeeded: "- Frasco Prostamax (20mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Modula a estrutura da cromatina e a expressão gênica em tecidos prostáticos.",
    dosingProtocol: "Semanas 1-2: 500mcg (5 UI)\nSemanas 3-4: 750mcg (7.5 UI)\nSemanas 5-8: 1.000mcg (10 UI)",
    storageInstructions: "Refrigerar a 2-8°C. Usar em até 2 semanas após reconstituição.",
    importantNotes: "Tradicionalmente administrado via intramuscular (IM).",
    howThisWorks: "Promove a descondensação da cromatina para restaurar a função celular jovem.",
    lifestyleFactors: "Dieta anti-inflamatória apoia a saúde da próstata.",
    potentialBenefitsSideEffects: "Benefícios: Melhora da função prostática. Efeitos: Mínimos.",
    injectionTechnique: "Intramuscular (IM).",
    references_content: "[1] Khavinson V. - Prostate bioregulation"
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
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/selank-10mg-vial-dosage-protocol/",
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
    id: "livagen-20mg",
    name: "Livagen (20mg)",
    category: "Longevidade & Anti-aging",
    description: "Tetrapeptídeo biorregulador (KEDA) que atua na descondensação da cromatina.",
    standardDosage: "500mcg - 2mg diário",
    protocol: "Injeção subcutânea diária por 8-12 semanas.",
    halfLife: "Curta",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/livagen-20mg-vial-dosage-protocol/",
    dosingReconstitutionGuide: "### Guia de Reconstituição\nAdicione 3.0 mL de água bacteriostática para uma concentração de ~6.67 mg/mL.",
    suppliesNeeded: "- Frasco Livagen (20mg)\n- Seringas de Insulina\n- Água Bacteriostática",
    protocolOverview: "Restaura a expressão gênica juvenil em células envelhecidas.",
    dosingProtocol: "Semanas 1-2: 0.5mg (7.5 UI)\nSemanas 3-4: 1.0mg (15 UI)\nSemanas 5-6: 1.5mg (22.5 UI)\nSemanas 7-12: 2.0mg (30 UI)",
    storageInstructions: "Liofilizado: -20°C. Reconstituído: 2-8°C.",
    importantNotes: "Frequentemente comparado ao Epitalon por seus efeitos epigenéticos.",
    howThisWorks: "Remodela a heterocromatina para reativar genes silenciados pelo envelhecimento.",
    lifestyleFactors: "Dieta rica em antioxidantes apoia a renovação celular.",
    potentialBenefitsSideEffects: "Benefícios: Rejuvenescimento celular, proteção hepática. Efeitos: Não relatados.",
    injectionTechnique: "Subcutânea.",
    references_content: "[1] Khavinson V. - Epigenetic regulation by short peptides"
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
    supplierLink: "https://peptidedosages.com/what-is-5-amino-1mq/",
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
    supplierLink: "https://peptidedosages.com/single-peptide-dosages/ghk-cu-50mg-vial-dosage-protocol/",
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
    supplierLink: "https://peptidedosages.com/what-is-tesamorelin/",
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
