import { useState, useEffect } from 'react';

export interface Peptide {
  id: string;
  name: string;
  category: string;
  description: string;
  standardDosage: string;
  protocol: string;
  halfLife: string;
  image: string;
  supplierLink: string;
  dosingReconstitutionGuide: string;
  suppliesNeeded: string;
  protocolOverview: string;
  dosingProtocol: string;
  storageInstructions: string;
  importantNotes: string;
  howThisWorks: string;
  lifestyleFactors: string;
  potentialBenefitsSideEffects: string;
  injectionTechnique: string;
  references: string;
}

export function usePeptides() {
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeptides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/peptides');
      if (!response.ok) throw new Error('Failed to fetch peptides');
      const data = await response.json();
      setPeptides(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeptides();
  }, []);

  return { peptides, loading, error, refetch: fetchPeptides };
}
