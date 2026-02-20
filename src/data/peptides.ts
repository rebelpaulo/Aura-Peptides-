export interface Study {
  title: string;
  link: string;
}

export interface Peptide {
  id: string;
  name: string;
  category: string;
  description: string;
  standardDosage: string;
  protocol: string;
  halfLife: string;
  studies: Study[];
  price: number;
  image: string;
  inStock: boolean;
}

const defaultImage = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800";
const secondaryImage = "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800";

export const peptidesData: Peptide[] = [
  // Fat Loss
  {
    id: "ipamorelin-fat-loss",
    name: "Ipamorelin",
    category: "Perda de Peso & Metabólico",
    description: "Secretagogo do hormônio do crescimento (GHRP) altamente seletivo que não aumenta significativamente o cortisol ou a prolactina.",
    standardDosage: "300mcg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM/PM.",
    halfLife: "2 horas",
    price: 45.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "tesamorelin-fat-loss",
    name: "Tesamorelin",
    category: "Perda de Peso & Metabólico",
    description: "Análogo do GHRH que reduz a gordura visceral e melhora a composição corporal.",
    standardDosage: "1mg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM/PM.",
    halfLife: "30-60 minutos",
    price: 95.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    category: "Perda de Peso & Metabólico",
    description: "Fragmento do hormônio do crescimento (HGH 177-191) que estimula a lipólise (queima de gordura) e inibe a lipogênese.",
    standardDosage: "300mcg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Curta",
    price: 55.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "semaglutide",
    name: "Semaglutida",
    category: "Perda de Peso & Metabólico",
    description: "Agonista do receptor GLP-1 que aumenta a secreção de insulina, reduz o glucagon e retarda o esvaziamento gástrico, promovendo saciedade.",
    standardDosage: "250mcg",
    protocol: "Administração semanal. Ciclo de 8 semanas on, 8 semanas off.",
    halfLife: "7 dias",
    price: 120.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "tirzepatide",
    name: "Tirzepatida",
    category: "Perda de Peso & Metabólico",
    description: "Duplo agonista dos receptores GIP e GLP-1, oferecendo efeitos sinérgicos na regulação do apetite e metabolismo da glicose.",
    standardDosage: "0.5mg",
    protocol: "3x por semana. 8 semanas on, 8 semanas off ou até atingir o peso ideal. Administrar AM.",
    halfLife: "5 dias",
    price: 150.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "retatrutide",
    name: "Retatrutida",
    category: "Perda de Peso & Metabólico",
    description: "Triplo agonista (GLP-1, GIP, Glucagon) com potente efeito na perda de peso e controle do apetite.",
    standardDosage: "0.5mg",
    protocol: "3x por semana. 8 semanas on, 8 semanas off ou até atingir o peso ideal. Administrar AM.",
    halfLife: "6 dias",
    price: 180.00,
    image: secondaryImage,
    inStock: false,
    studies: []
  },
  {
    id: "mots-c",
    name: "MOTS-C",
    category: "Perda de Peso & Metabólico",
    description: "Peptídeo derivado da mitocôndria que regula o metabolismo, melhora a sensibilidade à insulina e promove a longevidade.",
    standardDosage: "1mg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Curta",
    price: 65.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "ipamorelin-cjc-1295-no-dac",
    name: "Ipamorelin + CJC-1295 (Sem DAC)",
    category: "Perda de Peso & Metabólico",
    description: "Combinação sinérgica de GHRH e GHRP para maximizar a liberação natural do hormônio do crescimento.",
    standardDosage: "250mcg / 250mcg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM/PM.",
    halfLife: "30 min (CJC) / 2h (Ipamorelin)",
    price: 75.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },

  // Longevity
  {
    id: "cjc-1295-no-dac",
    name: "CJC-1295 (Sem DAC)",
    category: "Longevidade & Anti-aging",
    description: "Análogo do GHRH que estimula a liberação do hormônio do crescimento, promovendo longevidade e recuperação.",
    standardDosage: "200mcg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar PM.",
    halfLife: "30 minutos",
    price: 40.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "epitalon",
    name: "Epitalon",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo sintético conhecido por ativar a telomerase, alongar os telômeros e regular o ciclo do sono (melatonina).",
    standardDosage: "2mg",
    protocol: "Todos os dias. 20 dias seguidos, 3x por ano. Administrar PM.",
    halfLife: "Curta",
    price: 65.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "thymalin",
    name: "Thymalin",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo derivado do timo que regula o sistema imunológico e promove a longevidade.",
    standardDosage: "2mg",
    protocol: "Todos os dias. 20 dias seguidos, 3x por ano. Administrar PM.",
    halfLife: "Curta",
    price: 55.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "foxo4-dri",
    name: "FOXO4-DRI",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo senolítico que induz a apoptose em células senescentes (células 'zumbis' envelhecidas).",
    standardDosage: "1mg",
    protocol: "5 dias on, 2 dias off. Ciclo de 2 semanas, repetir 2-3 vezes por ano. Administrar AM.",
    halfLife: "Curta",
    price: 110.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "ss-31",
    name: "SS-31",
    category: "Longevidade & Anti-aging",
    description: "Peptídeo direcionado à mitocôndria que restaura a função mitocondrial e reduz o estresse oxidativo.",
    standardDosage: "500mcg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Curta",
    price: 85.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "nad-plus",
    name: "NAD+",
    category: "Longevidade & Anti-aging",
    description: "Coenzima essencial para a produção de energia celular, reparo do DNA e longevidade.",
    standardDosage: "100mg",
    protocol: "2-3 dias por semana, conforme a necessidade. Administrar AM.",
    halfLife: "Curta",
    price: 45.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },

  // Cognitive Enhancement
  {
    id: "melanotan-1",
    name: "Melanotan 1",
    category: "Cognição & Humor",
    description: "Análogo do a-MSH que pode ter efeitos cognitivos além do bronzeamento.",
    standardDosage: "250mcg",
    protocol: "2 dias por semana. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "1 hora",
    price: 35.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "semax",
    name: "Semax / NA Semax Amidate",
    category: "Cognição & Humor",
    description: "Peptídeo nootrópico desenvolvido na Rússia, derivado do ACTH, que melhora a memória, foco e neuroproteção.",
    standardDosage: "1mg",
    protocol: "2-3 dias por semana. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Minutos a horas",
    price: 45.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "selank",
    name: "Selank / NA Selank Amidate",
    category: "Cognição & Humor",
    description: "Peptídeo ansiolítico e nootrópico que reduz a ansiedade e melhora a clareza mental sem causar sedação.",
    standardDosage: "1mg",
    protocol: "2-3 dias por semana. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Minutos a horas",
    price: 45.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },

  // Healing
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    category: "Recuperação & Cicatrização",
    description: "Peptídeo de cobre natural conhecido por promover a produção de colágeno, cicatrização da pele e crescimento capilar.",
    standardDosage: "1.7mg",
    protocol: "Todos os dias. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "1 hora",
    price: 45.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    category: "Recuperação & Cicatrização",
    description: "Pentadecapeptídeo gástrico conhecido por suas propriedades aceleradas de cicatrização de tendões, músculos, intestinos e sistema nervoso.",
    standardDosage: "500mcg",
    protocol: "Todos os dias. Ciclo de 8 semanas on, 8 semanas off. Administrar AM/PM.",
    halfLife: "4-6 horas",
    price: 45.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "tb-500",
    name: "TB-500",
    category: "Recuperação & Cicatrização",
    description: "Versão sintética da Thymosin Beta-4 que promove a regulação da actina, angiogênese e cicatrização de feridas e lesões musculares.",
    standardDosage: "500mcg",
    protocol: "Todos os dias. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "7-12 dias",
    price: 55.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "bpc-157-tb-500-blend",
    name: "BPC-157 / TB-500 Blend",
    category: "Recuperação & Cicatrização",
    description: "Combinação dos dois peptídeos de cicatrização mais potentes para recuperação acelerada de lesões.",
    standardDosage: "250mcg / 250mcg",
    protocol: "Todos os dias. Ciclo de 8 semanas on, 8 semanas off. Administrar AM/PM.",
    halfLife: "Varia",
    price: 85.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "ara-290",
    name: "ARA-290",
    category: "Recuperação & Cicatrização",
    description: "Peptídeo que atua no receptor de reparo inato, útil para neuropatia e alívio da dor neuropática.",
    standardDosage: "1.5mg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Curta",
    price: 95.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },

  // Immunity
  {
    id: "thymosin-alpha-1",
    name: "Thymosin-Alpha 1",
    category: "Imunidade",
    description: "Peptídeo que modula o sistema imunológico, aumentando a resposta das células T contra infecções.",
    standardDosage: "1.5mg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "2 horas",
    price: 50.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "ll-37",
    name: "LL-37",
    category: "Imunidade",
    description: "Peptídeo antimicrobiano com propriedades antibacterianas, antivirais e antifúngicas.",
    standardDosage: "125mcg",
    protocol: "Todos os dias. 50 dias seguidos, 4 semanas off. Administrar AM.",
    halfLife: "Curta",
    price: 60.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "vip",
    name: "VIP (Vasoactive Intestinal Peptide)",
    category: "Imunidade",
    description: "Peptídeo imunomodulador útil no tratamento de toxicidade por mofo (CIRS) e inflamação sistêmica.",
    standardDosage: "50mcg",
    protocol: "Todos os dias. Ciclo de 8 semanas on, 8 semanas off. Administrar AM/PM.",
    halfLife: "Curta",
    price: 70.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "kpv",
    name: "KPV",
    category: "Imunidade",
    description: "Tripeptídeo com potentes propriedades anti-inflamatórias, útil para saúde intestinal e condições autoimunes.",
    standardDosage: "500mcg",
    protocol: "5 dias on, 2 dias off. Ciclo de 8 semanas on, 8 semanas off. Administrar AM.",
    halfLife: "Curta",
    price: 45.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },

  // Sexual Health
  {
    id: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Saúde Sexual",
    description: "Peptídeo que atua no sistema nervoso central para aumentar a libido e tratar a disfunção erétil e distúrbio do desejo sexual hipoativo.",
    standardDosage: "500mcg",
    protocol: "30 minutos antes da atividade sexual. Uso conforme a necessidade.",
    halfLife: "2-3 horas",
    price: 45.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "oxytocin",
    name: "Oxytocin",
    category: "Saúde Sexual",
    description: "O 'hormônio do amor', promove vínculo, relaxamento e pode melhorar a função sexual.",
    standardDosage: "50mcg",
    protocol: "Uso conforme a necessidade. Administrar AM.",
    halfLife: "Curta",
    price: 35.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "kisspeptin",
    name: "Kisspeptin",
    category: "Saúde Sexual",
    description: "Regula o eixo HPG, estimulando a liberação de GnRH e, consequentemente, testosterona e libido.",
    standardDosage: "125mcg",
    protocol: "Todos os dias. 1 hora antes de dormir. Ciclo de 30 dias on, 30 dias off.",
    halfLife: "Curta",
    price: 55.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },

  // Muscle Building
  {
    id: "igf-1-lr3",
    name: "IGF-1 LR3",
    category: "Construção Muscular",
    description: "Versão de longa duração do IGF-1, promove hiperplasia muscular (criação de novas células musculares) e recuperação.",
    standardDosage: "50mcg",
    protocol: "10 dias seguidos. Ciclo de 10 dias on, 4 semanas off. Administrar AM.",
    halfLife: "20-30 horas",
    price: 80.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },
  {
    id: "l-carnitine",
    name: "L-Carnitine (Injetável)",
    category: "Construção Muscular",
    description: "Aminoácido que transporta ácidos graxos para as mitocôndrias para serem queimados como energia. Aumenta a densidade dos receptores androgênicos.",
    standardDosage: "200-600mg",
    protocol: "Todos os dias. Uso contínuo conforme a necessidade. Administrar AM.",
    halfLife: "Curta",
    price: 30.00,
    image: defaultImage,
    inStock: true,
    studies: []
  },
  {
    id: "follistatin-344",
    name: "Follistatin 344",
    category: "Construção Muscular",
    description: "Inibidor da miostatina que promove o crescimento muscular significativo.",
    standardDosage: "50mcg",
    protocol: "Dias de treino. 30 minutos pré-treino IM (intramuscular). Ciclo de 8 semanas on, 8 semanas off.",
    halfLife: "Curta",
    price: 120.00,
    image: secondaryImage,
    inStock: true,
    studies: []
  },

  // Sleep
  {
    id: "dsip",
    name: "DSIP (Delta Sleep-Inducing Peptide)",
    category: "Sono & Recuperação",
    description: "Peptídeo que promove o sono de ondas lentas (sono profundo), melhorando a qualidade do descanso e a recuperação.",
    standardDosage: "250mcg",
    protocol: "5 dias on, 2 dias off. 1-3 horas antes de dormir. Ciclo de 8 semanas on, 8 semanas off.",
    halfLife: "Curta",
    price: 45.00,
    image: defaultImage,
    inStock: true,
    studies: []
  }
];
