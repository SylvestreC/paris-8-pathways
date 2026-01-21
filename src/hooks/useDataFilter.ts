import { useState, useMemo, useCallback } from 'react';
import { StudentRecord, mockData } from '@/data/mockData';

export interface FilterState {
  niveau: string | null;
  domaine: string | null;
  secteur: string | null;
  annee: number | null;
}

export const useDataFilter = () => {
  const [filters, setFilters] = useState<FilterState>({
    niveau: null,
    domaine: null,
    secteur: null,
    annee: null,
  });

  const filteredData = useMemo(() => {
    return mockData.filter(record => {
      if (filters.niveau && record.niveau !== filters.niveau) return false;
      if (filters.domaine && record.domaine !== filters.domaine) return false;
      if (filters.secteur && record.secteurProfessionnel !== filters.secteur) return false;
      if (filters.annee && record.annee !== filters.annee) return false;
      return true;
    });
  }, [filters]);

  const setFilter = useCallback((key: keyof FilterState, value: string | number | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      niveau: null,
      domaine: null,
      secteur: null,
      annee: null,
    });
  }, []);

  const toggleFilter = useCallback((key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  }, []);

  return {
    filters,
    filteredData,
    setFilter,
    clearFilters,
    toggleFilter,
    totalCount: mockData.length,
    filteredCount: filteredData.length,
  };
};
