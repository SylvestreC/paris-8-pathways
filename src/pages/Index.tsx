import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatCards } from '@/components/dashboard/StatCards';
import { DistributionChart } from '@/components/charts/DistributionChart';
import { SankeyChart } from '@/components/charts/SankeyChart';
import { NetworkChart } from '@/components/charts/NetworkChart';
import { MethodologyNote } from '@/components/dashboard/MethodologyNote';
import { useDataFilter, FilterState } from '@/hooks/useDataFilter';

const Index = () => {
  const {
    filters,
    filteredData,
    toggleFilter,
    clearFilters,
    totalCount,
    filteredCount,
  } = useDataFilter();

  const [distributionView, setDistributionView] = useState<'domaine' | 'secteur'>('domaine');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header totalCount={totalCount} filteredCount={filteredCount} />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <StatCards data={filteredData} />

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Distribution Chart */}
          <DistributionChart
            data={filteredData}
            filters={filters}
            onToggleFilter={toggleFilter}
            viewMode={distributionView}
            onViewModeChange={setDistributionView}
          />

          {/* Network Chart */}
          <NetworkChart
            data={filteredData}
            filters={filters}
            onToggleFilter={toggleFilter}
          />
        </div>

        {/* Sankey Chart - Full Width */}
        <SankeyChart
          data={filteredData}
          filters={filters}
          onToggleFilter={toggleFilter}
        />
      </main>

      {/* Methodology Note */}
      <MethodologyNote />

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-4 text-center text-xs text-muted-foreground">
        <p>
          Observatoire des parcours étudiants • Université Paris 8 • 
          Visualisation développée avec D3.js
        </p>
      </footer>
    </div>
  );
};

export default Index;
