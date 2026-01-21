import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterState } from '@/hooks/useDataFilter';
import { DOMAINES, SECTEURS_PROFESSIONNELS } from '@/data/mockData';

interface FilterBarProps {
  filters: FilterState;
  onToggleFilter: (key: keyof FilterState, value: string | number) => void;
  onClearFilters: () => void;
}

export const FilterBar = ({ filters, onToggleFilter, onClearFilters }: FilterBarProps) => {
  const hasActiveFilters = Object.values(filters).some(v => v !== null);
  const years = [2020, 2021, 2022, 2023, 2024];
  const niveaux = ['Licence', 'Master'];

  return (
    <div className="border-b border-border bg-muted/30 px-6 py-3">
      <div className="flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
        </div>

        {/* Niveau */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Niveau</span>
          <div className="flex gap-1">
            {niveaux.map(niveau => (
              <button
                key={niveau}
                onClick={() => onToggleFilter('niveau', niveau)}
                className={`filter-button ${filters.niveau === niveau ? 'active' : ''}`}
              >
                {niveau}
              </button>
            ))}
          </div>
        </div>

        {/* Années */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Année</span>
          <div className="flex gap-1">
            {years.map(year => (
              <button
                key={year}
                onClick={() => onToggleFilter('annee', year)}
                className={`filter-button ${filters.annee === year ? 'active' : ''}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="mr-1 h-4 w-4" />
            Effacer les filtres
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filters.niveau && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Niveau: {filters.niveau}
              <button onClick={() => onToggleFilter('niveau', filters.niveau!)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.domaine && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Domaine: {filters.domaine}
              <button onClick={() => onToggleFilter('domaine', filters.domaine!)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.secteur && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Secteur: {filters.secteur}
              <button onClick={() => onToggleFilter('secteur', filters.secteur!)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.annee && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Année: {filters.annee}
              <button onClick={() => onToggleFilter('annee', filters.annee!)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
